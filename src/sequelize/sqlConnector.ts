import { Sequelize } from 'sequelize';
import { BaseConnector } from '../baseConector';

export class SqlConnector extends BaseConnector<Sequelize> {
    /**
     * Creates a new sequelize connection and maps it to the given name. If no uri
     * is provided, a uri is created from the db configuration data.
     *
     * @param name
     * @param uri
     */
    public async createConnection(name: string, uri?: string): Promise<Sequelize> {
        throw new Error('Method not implemented.');
    }

    /**
     * Closes all the sequelize db connections.
     */
    public closeConnections(): Promise<void[]> {
        const promises = Object.values(this._connections).map((connection) => connection.close());

        this._connections = {};

        return Promise.all(promises);
    }
}
