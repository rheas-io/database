import { Mongoose } from 'mongoose';
import { MongoDbConnector } from './mongoose';
import { DriverManager } from '@rheas/services';
import { IDbConfig } from '@rheas/contracts/configs';
import { IDbConnector } from '@rheas/contracts/database';

export class DbManager extends DriverManager<IDbConnector<Mongoose>> {
    /**
     * Database configuration details.
     *
     * @var IDbConfig
     */
    protected _config: IDbConfig;

    /**
     * Sets the default driver key/name.
     *
     * @var string
     */
    protected _defaultDriver: string;

    /**
     * Creates a new database connection manager. With this manager, we
     * can connect to multiple databases and get the connectors using keys.
     *
     * By default, a single database connector will only be available - the one
     * specified in the configuration file. Others can be registered and used
     *
     * @param config
     */
    constructor(config: IDbConfig) {
        super();

        this._config = config;
        this._defaultDriver = this._config.connector;
    }

    /**
     * Registers a connector defined in the database config file.
     */
    public registerConfigConnector() {
        this.registerConnector(this._config.connector);
    }

    /**
     * Registers a connector for the given name.
     *
     * @param name
     */
    public registerConnector(name: 'sequelize' | 'mongoose') {
        this.registerDriver(name, new MongoDbConnector(this._config));
    }
}
