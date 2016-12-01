
exports.up = function(knex, Promise) {
	return knex.schema.createTable('users', function(table) {
		table.increments('id');
		table.string('google_id').notNullable().unique();
		table.string('email').notNullable().unique();
		table.string('first_name');
		table.string('last_name');
		table.string('photo_url');
		table.text('bio');
		table.dateTime('created_at');
		table.dateTime('updated_at');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users');
};
