import { Exception } from '@rheas/errors';
import mongoose, { Mongoose } from 'mongoose';
import { IDbConfig } from '@rheas/contracts/configs';
import { IDbConnector, KeyValue } from '@rheas/contracts';

export class MongoDbConnector implements IDbConnector<Mongoose> {
    /**
     * Database configuration.
     *
     * @var IDbConfig
     */
    protected _config: IDbConfig;

    /**
     * Cache of all the mongoose connections.
     *
     * @var KeyValue
     */
    protected _connections: KeyValue<Mongoose> = {};

    /**
     * Creates a new MongoDb connector
     *
     * @param config
     */
    constructor(config: IDbConfig) {
        this._config = config;
    }

    /**
     * Connect to Mongodb server and return a Promise. The database details are
     * fetched from the configuration file.
     */
    public async connect(): Promise<typeof mongoose> {
        return this.createConnection('default');
    }

    /**
     * Creates a new MongoDb connection and maps it to the given name. If no uri
     * is provided, a uri is created from the db config data.
     *
     * useUnifiedTopology and useNewUrlParser options are set to true by default.
     * To override these options, set these options on the config file.
     *
     * @param name
     * @param uri
     */
    public async createConnection(name: string, uri?: string): Promise<typeof mongoose> {
        if (!uri) {
            // Create uri from the configuration data, if no uri is submitted.
            let { host, port, database } = this._config;
            uri = this.getUrl(host, port, database);
        }

        let options = { useUnifiedTopology: true, useNewUrlParser: true };
        options = Object.assign(options, this._config.options);

        this._connections[name] = await mongoose.connect(uri, options);

        return this._connections[name];
    }

    /**
     * Returns a Mongodb server url from host, port and database name.
     *
     * @param host
     * @param port
     * @param database
     */
    public getUrl(host: any, port: any, database: any): string {
        host = host.replace('/', '');
        database = database.replace('/', '');

        return `mongodb://${host}:${port}/${database}`;
    }

    /**
     * Returns a mongoose connection mapped to the given name. If no name
     * is given, we will fetch the default connection.
     *
     * Throws an exception if no connection is mapped to the given name.
     *
     * @returns
     * @throws
     */
    public connection(name?: string): Mongoose {
        const connectionKey = name ?? 'default';
        const connection = this._connections[connectionKey];

        if (!connection) {
            throw new Exception(`A connection for the key ${name} is not found.`);
        }
        return connection;
    }

    /**
     * Closes all the MongoDb connections.
     */
    public closeConnections(): Promise<void[]> {
        const promises = mongoose.connections.map((connection) => connection.close());

        return Promise.all(promises);
    }
}
