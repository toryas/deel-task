import { Sequelize } from 'sequelize';
import { Profile } from '../models/profile.model';
import { Contract } from '../models/contract.model'
import { Job } from '../models/job.model'



export class ModelUtil {
    static init() {
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './database.sqlite3'
        });

        Profile.initModel(sequelize);
        Contract.initModel(sequelize);
        Job.initModel(sequelize);
        Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' })
        Contract.belongsTo(Profile, { as: 'Contractor' })
        Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' })
        Contract.belongsTo(Profile, { as: 'Client' })
        Contract.hasMany(Job)
        Job.belongsTo(Contract)
        return sequelize;
    }
} 