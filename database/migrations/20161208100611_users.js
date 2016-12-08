exports.up = function(knex, Promise) {
    return knex.schema.table('users', (table) => {
        table.string('city');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', (table) => {
        table.dropColumn('city');
    });
};