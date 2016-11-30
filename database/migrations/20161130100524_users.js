
exports.up = function(knex, Promise) {
	return knex.schema.createTable('users', function(table) {
		table.increments('id');
		table.string('email').notNullable().unique();
		table.string('password_hash').notNullable();
		table.string('first_name');
		table.string('last_name');
		table.text('bio');
		table.dateTime('created_at');
		table.dateTime('updated_at');
	});

};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users');
};
