const knex = require('../knex');

var Collections = function() {
    return knex('collections');
};

module.exports = {
    getAllCollections: Collections,
    addCollection: function(collection) {
        return Collections().insert({
            owner_id: collection.ownerID,
            item_count: 0,
            name: collection.name,
            description: collection.description,
            created_at: new Date(),
            updated_at: new Date()
        });
    },
    getUsersCollections: function(userID) {
        return Collections().where('user_id', userID);
    }
}