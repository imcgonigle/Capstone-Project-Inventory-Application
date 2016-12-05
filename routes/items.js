const express = require('express');
const router = express.Router();
const multer = require('multer');

const itemQueries = require('../database/quries/items');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let path = __dirname + '/../public/uploads/';
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, req.params.collection_id + 'items' + req.body.collection.item_count + '.' + file.originalname.slice(-3));
    }
});

var upload = multer({ storage: storage });

router.post('/add/:collection_id', isLoggedIn, upload.single('image_url'), function(req, res, next) {
    let url = '';
    req.file ? url = '/uploads/' + req.file.filename : url = '/images/defaults/items.png';
    collectionQueries.getCollectionByID(req.params.collection_id)
        .then(collections => {
            const collection = collections[0];
            if (collections.user_id == req.user.id) {
                const item = {
                    name: req.body.name,
                    description: req.body.description,
                    collection_id: collection.id,
                    brand: req.params.brand,
                    serial_number: req.params.serial_number,
                    image_url: url,
                    rating: req.params.rating,
                    created_at: new Date(),
                    updated_at: new Date()
                };
                itemQueries.addItem(item)
                    .then(data => {
                        res.redirect('/dashboard/collection/' + collection.id);
                    })
                    .catch(error => {
                        return next(error);
                    });
            } else {
                res.redirect('/');
            }
        })
        .catch(error => {
            return next(error);
        });
});

router.post('/delete/:id', isLoggedIn, function(req, res, next) {
    itemQueries.getItemByID(req.params.id)
        .then(items => {
            let item = items[0];
            if (item.user_id == req.user.id) {
                itemQueries.deleteItem(item.id)
                    .then(data => {
                        res.redirect('/collecion/' + item.collection_id);
                    })
                    .catch(error => {
                        return next(error);
                    });
            } else {
                res.redirect('/');
            }
        })
        .catch(error => {
            return next(error);
        });
});

router.post('/update/:id', isLoggedIn, function(req, res, next) {
    itemQueries.getItemByID(req.params.id)
        .then(items => {
            let item = items[0];

            item.name = req.body.name;
            item.rating = req.body.rating;
            item.description = req.body.description;
            item.updated_at = new Date();
            item.brand = req.body.brand;
            item.image_url = req.body.image_url;
            item.serial_number = req.body.serial_number;

            if(item.user_id == req.user.id) {
                itemQueries.updateItem(item)
                    .then(data => {
                        res.redirect('/collection/' + item.collection_id);
                    })
                    .catch(error => {
                        return next(error);
                    });
            } else {
                res.redirect('/');
            }
        })
        .catch(error => {
            return next(error);
        });
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated) {
        return next();
    }
    res.redirect('/');
};




module.exports = router;