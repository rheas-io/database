import { BaseModel as Model } from '../baseModel';
import { IMongoModel as IModel } from '@rheas/contracts/database';
import { Mongoose as Con, Model as Mod, Schema, Document as Doc } from 'mongoose';

abstract class MongoModel<T extends Doc> extends Model<Con, Mod<T>, Schema> implements IModel<T> {
    /**
     * Creates a new model from the schema with the class name.
     *
     * @returns
     */
    public createModel(): Mod<T, {}> {
        return this.connection().model(this.modelName(), this.schema());
    }

    /**
     * Mongoose connector has to be used for MongoDb database.
     *
     * @returns
     */
    public dbConnector(): string {
        return 'mongoose';
    }
}

export { MongoModel };
