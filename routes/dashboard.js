var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let path = __dirname + '/../public/uploads/';
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, req.user.id + 'collection' + req.user.collection_count + '.' + file.originalname.slice(-3));
    }
});

var upload = multer({ storage: storage });

const collectionQueries = require('../database/queries/collection_queries.js');

router.get('/', isLoggedIn, function(req, res, next) {
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

router.get('/collections', isLoggedIn, function(req, res, next) {
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

router.post('/collection/new', upload.single('thumbnail'), function(req, res, next) {
    var url = '';
    req.file ? url = '/uploads/' + req.file.filename : url = '/images/defaults/collections.png';
    const newCollection = {
        thumbnailURL: url,
        name: req.body.name,
        description: req.body.description,
        ownerID: req.user.id
    };

    collectionQueries.addCollection(newCollection)
        .then(data => {
            res.redirect('/dashboard/collections/');
        })
        .catch(error => {
            return next(error);
        });

});

router.post('/collection/delete/:id', isLoggedIn, function(req, res, next) {
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

router.post('/collection/rename/:id', isLoggedIn, function(req, res, next) {
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

router.get('/collection/:id', isLoggedIn, function(req, res, next) {
    collectionQueries.getCollectionByID(req.params.id)
        .then(collections => {
            let collection = collections[0];
            collectionQueries.getCollectionItems(req.params.id)
                .then(items => {
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
        })
        .catch(error => {
            return next(error);
        });
});


router.get('/settings', isLoggedIn, function(req, res, next) {
    res.render('dashboard/settings', {
        user: req.user,
        title: '| Settings'
    });
});

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

module.exports = router;