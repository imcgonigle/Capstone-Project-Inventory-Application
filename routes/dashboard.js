var express = require('express');
var router = express.Router();


const collectionQueries = require('../database/queries/collection_queries.js');

router.get('/', function(req, res, next) {
    collectionQueries.getCollectionCount(req.user.id)
        .then(data => {
            req.user.collection_count = data[0].count
            res.render('dashboard/index', {
                user: req.user,
                title: "| Dashboard"
            });
        })
        .catch(error => {
            return next(error);
        })
});

router.get('/collections', function(req, res, next) {
    collectionQueries.getUsersCollections(req.user.id)
        .then(collections => {
            res.render('dashboard/collections', {
                user: req.user,
                title: '| Collections',
                collections: collections
            });
        })
        .catch(error => {
            return next(error);
        });

});

router.post('/collection/new', function(req, res, next) {

    console.log(req.body);

    const newCollection = {
        thumbnailURL: req.body.avatar_url,
        name: req.body.name,
        description: req.body.description,
        ownerID: req.user.id
    };

    console.log('router collection', newCollection);

    collectionQueries.addCollection(newCollection)
        .then(data => {
            res.redirect('/dashboard/collections/');
        })
        .catch(error => {
            return next(error);
        });

});

router.post('/collection/delete/:id', function(req, res, next) {
    collectionQueries.getCollectionByID(req.params.id)
        .then(collections => {
            let collection = collections[0];
            if (req.user.id == collection.owner_id) {
                collectionQueries.deleteCollection(collection.id)
                    .then(data => {
                        res.redirect('/dashboard/collections/');
                    })
                    .catch(error => {
                        return next(error);
                    })
            } else {
                res.redirect('/')
            }
        })
        .catch(error => {
            return next(error);
        });
});

router.post('/collection/rename/:id', function(req, res, next) {
    collectionQueries.getCollectionByID(req.params.id)
        .then(collections => {
            let collection = collections[0];
            if (req.user.id == collection.owner_id) {
                collection.name = req.body.name;
                collection.description = req.body.description;
                collectionQueries.updateCollection(collection)
                    .then(data => {
                        res.redirect('/dashboard/collection/' + collection.id);
                    })
                    .catch(error => {
                        return next(error);
                    })
            } else {
                res.redirect('/');
            }
        })
        .catch(error => {
            return next(error);
        });

});

router.get('/collection/:id', function(req, res, next) {
    collectionQueries.getCollectionByID(req.params.id)
        .then(collections => {
            let collection = collections[0];
            collectionQueries.getCollectionItems(req.params.id)
                .then(items => {
                    if (collection.item_count == items.length) {
                        res.render('dashboard/collection_page', {
                            user: req.user,
                            items: items,
                            collection: collection,
                            title: '| Collection'
                        });
                    } else {
                        collection.item_count = items.length;
                        collectionQueries.updateCollection(collection)
                            .then(data => {
                                res.render('dashboard/collection_page', {
                                    user: req.user,
                                    items: items,
                                    collection: collection,
                                    title: '| Collection'
                                });
                            })
                            .catch(error => {
                                return next(error);
                            });
                    };

                })
                .catch(error => {
                    return next(error);
                });
        })
        .catch(error => {
            return next(error);
        });
});


router.get('/settings', function(req, res, next) {
    res.render('dashboard/settings', {
        user: req.user,
        title: '| Settings'
    });
});

module.exports = router;