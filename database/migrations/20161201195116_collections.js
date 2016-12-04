exports.up = function(knex, Promise) {
    return knex.schema.createTable('collections', function(table) {
        table.increments('id');
        table.integer('owner_id');
        table.integer('item_count');
        table.string('name');
        table.text('description');
        table.date('created_at');
        table.date('updated_at');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('collections');
};