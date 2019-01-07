const mongoose = require('mongoose');

const Location = require('../models/Location');

exports.locations_get_all = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Location.find()
        .select('_id name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                locations: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        requests: requests(domain, doc._id)
                    }
                }),
                requests: requests(domain)
            })
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};

exports.locations_get_location = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Location.findById(req.params.locationId)
        .select('_id name')
        .exec()
        .then(location => {
            res.status(200).json({
                location: {
                    _id: location._id,
                    name: location.name,
                    requests: requests(domain, location._id)
                },
                requests: requests(domain)
            })
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};

exports.locations_create_location = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    const location = new Location({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });

    location.save()
        .then(result => {
            if (result) {
                res.status(201).json({
                    message: "Location saved",
                    location: result,
                    requests: requests(domain)
                });
            } else {
                res.status(404).json({
                    message: "Object not found"
                })
            }
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};

exports.locations_delete_location = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Location.remove({
        _id: req.params.locationId
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Location deleted',
                result: result,
                requests: requests(domain)
            });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};

function requests(domain, id) {
    if (id) {
        return [
            {
                type: 'GET',
                url: domain + '/locations/' + id
            },
            {
                type: 'DELETE',
                url: domain + '/locations/' + id
            }
        ]
    } else {
        return [
            {
                type: 'GET',
                url: domain + '/locations/'
            },
            {
                type: 'POST',
                url: domain + '/locations/',
                data: {
                    'name': {
                        'type': 'String',
                        'required': true,
                    }
                }
            }
        ]
    }
}