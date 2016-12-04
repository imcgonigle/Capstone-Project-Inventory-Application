require('dotenv').config();
const pg = require('pg');

module.exports = {

    development: {
        client: 'postgres',
        connection: 'postgresql://localhost/inventory_application',
        migrations: {
            directory: './database/migrations'
        },
        seeds: {
            directory: './database/seeds'
        }
    },

    // staging: {
    //   client: 'postgresql',
    //   connection: {
    //     database: 'my_db',
    //     user:     'username',
    //     password: 'password'
    //   },
    //   pool: {
    //     min: 2,
    //     max: 10
    //   },
    //   migrations: {
    //     tableName: 'knex_migrations'
    //   }
    // },

    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL + '?ssl=true',
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './database/migrations'
        },
        seeds: {
            directory: './database/seeds'
        }
    }

};