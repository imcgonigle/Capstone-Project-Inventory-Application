exports.up = function(knex, Promise) {
    return knex.schema.createTable('items', function(table) {
        table.increments('id');
        table.integer('collection_id');
        table.string('name').notNullable().unique();
        table.string('brand');
        table.string('serial_number');
        table.string('image_url').notNullable();
        table.text('description');
        table.integer('rating');
        table.date('created_at');
        table.date('updated_at');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('items');
};