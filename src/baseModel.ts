import { IDbConnector } from '@rheas/contracts';
import { IModel } from '@rheas/contracts/database';
import { IDriverManager } from '@rheas/contracts/services';

export abstract class BaseModel<Connection = any, Model = any, Schema = any> implements IModel{
    /**
     * Application's database connection manager.
     *
     * @var IDriverManager
     */
    private static _dbManager: IDriverManager<IDbConnector<any>>;

    /**
     * Cache of the underlying ORM model.
     *
     * @var Mongoose.Model
     * @var SequelizeModel
     */
    protected static _model: any;

    /**
     * Name of the database connection to be used with this model.
     *
     * @var string
     */
    protected _connection: string = 'default';

    /**
     * Name of this model. Plural will be the database name.
     *
     * @var string
     */
    protected _modelName: string | undefined;

    /**
     * Database name. If no value is set plural of the `_modelName`
     * will be used.
     *
     * @var string
     */
    protected _dbName: string | undefined;

    /**
     * Creates an ORM/ODM model and returns it.
     *
     * @returns
     */
    public abstract createModel(): Model;

    /**
     * Returns the model schema.
     *
     * @returns
     */
    public abstract schema(): Schema;

    /**
     * Returns the database connector name. A connector with this name
     * will be fetched from the application db connector manager.
     *
     * @returns
     */
    public abstract dbConnector(): string;

    /**
     * Sets the application database driver manager. Will come in handy to
     * get the database connections.
     *
     * @param dbManager
     */
    public static setDatabaseDriverManager(dbManager: IDriverManager<IDbConnector<any>>) {
        BaseModel._dbManager = dbManager;
    }

    /**
     * Returns the application driver manager.
     *
     * @returns
     */
    public static dbDriverManager() {
        return BaseModel._dbManager;
    }

    /**
     * Returns the database connector for the model.
     *
     * @returns
     */
    public connector(): IDbConnector<Connection> {
        const manager = BaseModel.dbDriverManager();

        return manager.getDriver(this.dbConnector());
    }

    /**
     * Returns database connection from the database connector.
     *
     * @returns
     */
    public connection(): Connection {
        const connector = this.connector();

        return connector.connection(this._connection);
    }

    /**
     * Sets the name of the db connection to use with this model.
     *
     * @param name
     */
    public setConnection(name: string) {
        this._connection = name;

        // When connection changes, we have to remove the model. So that
        // new model requests are performed on new connection.
        return this.resetModel();
    }

    /**
     * Removes the model cache. Once removed, new requests will force the
     * creation of model on the current connection.
     *
     * @returns
     */
    public resetModel() {
        BaseModel._model = undefined;

        return this;
    }

    /**
     * Returns the underlying ORM model.
     *
     * @returns
     */
    public model(): Model {
        return (BaseModel._model = BaseModel._model || this.createModel());
    }

    /**
     * Returns the name of this model.
     *
     * @returns
     */
    public modelName(): string {
        return this._modelName || this.constructor.name;
    }
}
