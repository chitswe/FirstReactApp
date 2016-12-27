/**
 * Created by ChitSwe on 12/22/16.
 */
import Umzug from 'umzug';
import db from  '../../models';
const umzug = new Umzug(
    {
        storage:'sequelize',
        storageOptions:{
            sequelize:db.sequelize
        },
        migrations:{
            path:'server/database/migrations',// The pattern that determines whether or not a file is a migration.
            pattern: /^\d+[\w-]+\.js$/,
            params: [db.sequelize.getQueryInterface(), db.Sequelize]
        }
    });

export default umzug.up();