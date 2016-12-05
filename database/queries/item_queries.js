const knex = require('../knex.js');

const Items = function() {
    return knex('items');
};

module.exports = {
    Items: Items,
    getItemByID: function(id) {
        return Items().where('id', id)
            .join('collection', 'collections.id', 'items.collection_id')
            .select(
                'items.id',
                'collections.user_id',
                'item.name', 'item.brand',
                'item.serial_number',
                'item.description',
                'item.created_at',
                'item.updated_at',
                'item.rating',
                'item.image_url',
                'item.id'
            );
    },
    getItemsByCollectionID: function(collection_id) {
        return Items().where('collection_id', collection_id);
    },
    addItem: function(item) {
        knex('collections').where('id', '=', item.collection_id)
            .increment('item_count', 1)
            .then(data => { console.log(data) })
            .catch(error => { console.error(error) });

        return Items().insert(item);
    },
    updateItem: function(item) {
        return Items().where('id', item.id).update(item);
    },
    deleteItem: function(id) {
        return Items().where('id', id).del();
    }

};