import { Exception } from '@rheas/errors';
import { IDbConfig } from '@rheas/contracts/configs';
import { IDbConnector, KeyValue } from '@rheas/contracts';

export abstract class BaseConnector<T> implements IDbConnector<T> {
    /**
     * Database configuration.
     *
     * @var IDbConfig
     */
    protected _config: IDbConfig;

    /**
     * Cache of all the db connections.
     *
     * @var KeyValue
     */
    protected _connections: KeyValue<T> = {};

    /**
     * Creates a new db connector which is responsible for creating,
     * caching and closing the db connections.
     *
     * @param config
     */
    constructor(config: IDbConfig) {
        this._config = config;
    }

    /**
     * Creates a new db connection and maps it to the given name. If no uri
     * is provided, a uri is created from the db config data.
     *
     * @param name
     * @param uri
     */
    public abstract createConnection(name: string, uri?: string): Promise<T>;

    /**
     * Closes all the db connections.
     */
    public abstract closeConnections(): Promise<void[]>;

    /**
     * Connect to db server and return a Promise. The database details are
     * fetched from the configuration file.
     */
    public async connect(): Promise<T> {
        return this.createConnection('default');
    }

    /**
     * Returns a db connection mapped to the given name. If no name is given,
     * we will fetch the default connection.
     *
     * Throws an exception if no connection is mapped to the given name.
     *
     * @returns
     * @throws
     */
    public connection(name?: string): T {
        const connectionKey = name ?? 'default';
        const connection = this._connections[connectionKey];

        if (!connection) {
            throw new Exception(`A connection for the key ${name} is not found.`);
        }
        return connection;
    }
}
