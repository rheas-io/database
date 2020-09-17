import mongoose, { Mongoose } from 'mongoose';
import { BaseConnector } from '../baseConector';

export class MongoDbConnector extends BaseConnector<Mongoose> {
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
     * Closes all the MongoDb connections.
     */
    public closeConnections(): Promise<void[]> {
        const promises = mongoose.connections.map((connection) => connection.close());

        return Promise.all(promises);
    }
}
