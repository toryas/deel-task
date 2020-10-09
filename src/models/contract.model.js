import { Sequelize } from 'sequelize';

export class Contract extends Sequelize.Model {
    static initModel(sequelize) {
        Contract.init(
            {
              terms: {
                type: Sequelize.TEXT,
                allowNull: false
              },
              status:{
                type: Sequelize.ENUM('new','in_progress','terminated')
              }
            },
            {
              sequelize,
              modelName: 'Contract'
            }
          );
    }

}