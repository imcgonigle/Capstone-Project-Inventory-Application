const knex = require('../knex');

var Collections = function() {
    return knex('collections');
};

module.exports = {
    getAllCollections: Collections,
    getCollectionByID: function(collectionID) {
        return Collections().where('id', collectionID);
    },
    addCollection: function(collection) {
        knex('users')
            .where('id', '=', collection.ownerID)
            .increment('collection_count', 1)
            .then(data => { console.log(data) })
            .catch(error => { console.error(error) })

        return Collections().insert({
                owner_id: collection.ownerID,
                item_count: 0,
                name: collection.name,
                description: collection.description,
                thumbnail_url: collection.thumbnailURL,
                created_at: new Date(),
                updated_at: new Date()
            })
            .returning('id');
    },
    getCollectionCount: function(userID) {
        return Collections().where('owner_id', userID).count('owner_id');
    },
    getItemCount: function(collection_id) {
        return Collections().join('items', 'collections.id', 'items.collection_id')
            .where('collection_id', collection_id)
            .count('collection_id');
    },
    getUsersCollections: function(userID) {
        return Collections().where('owner_id', userID);
    },
    getCollectionItems(collectionID) {
        return knex('items').where('collection_id', collectionID);
    },
    deleteCollection: function(collectionID) {
        return Collections().where('id', collectionID).del();
    },
    updateCollection: function(collection) {
        return Collections().where('id', collection.id).update({
            name: collection.name,
            item_count: collection.item_count,
            description: collection.description,
            updated_at: new Date()
        });
    }
}