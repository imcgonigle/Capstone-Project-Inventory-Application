exports.up = function(knex, Promise) {
    return knex.schema.createTable('collections', function(table) {
        table.increments('id');
        table.integer('owner_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.integer('item_count');
        table.string('thumbnail_url').notNullable();
        table.string('name').notNullable().unique();
        table.text('description');
        table.date('created_at');
        table.date('updated_at');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('collections');
};