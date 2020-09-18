import { BaseModel } from './baseModel';
import { DbManager } from './dbManager';
import { IApp } from '@rheas/contracts/core/app';
import { ServiceProvider } from '@rheas/services';
import { InstanceHandler } from '@rheas/contracts/container';

export class DbServiceProvider extends ServiceProvider {
    /**
     * Returns the database service resolver. Database service is
     * an app level service, so application instance will be passed
     * as container instance.
     *
     * @returns
     */
    public serviceResolver(): InstanceHandler {
        return (app) => {
            const dbManager = new DbManager((app as IApp).configs().get('db'));

            // Register the application default connector using the
            // configuration data.
            dbManager.registerConfigConnector();

            // Set the db driver manager on Model.
            BaseModel.setDatabaseDriverManager(dbManager);

            return dbManager;
        };
    }
}
