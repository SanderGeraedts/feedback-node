const mongoose = require('mongoose');

const Feedback = require('../models/Feedback');
const Location = require('../models/Location');

exports.feedback_get_all = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Feedback.find()
        .select('_id value location submitted_on')
        .populate('location')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                feedback: docs.map(doc => {
                    return {
                        _id: doc._id,
                        value: doc.value,
                        location: doc.location,
                        submitted_on: doc.submitted_on,
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

exports.feedback_get_feedback = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Feedback.findById(req.params.feedbackId)
        .select('_id value location submitted_on')
        .populate('location')
        .then(feedback => {
            res.status(200).json({
                feedback: {
                    _id: feedback._id,
                    value: feedback.value,
                    location: feedback.location,
                    submitted_on: feedback.submitted_on,
                    requests: requests(domain, feedback._id)
                },
                requests: requests(domain)
            })
        })
};

exports.feedback_create_feedback = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Location.findById(req.body.location)
        .then(location => {
            if (!location) {
                res.status(422).json({
                    message: 'Location not Found',
                    error: err
                })
            }

            const feedback = new Feedback({
                _id: new mongoose.Types.ObjectId(),
                value: req.body.value,
                location: req.body.location
            });

            feedback.save()
                .then(result => {
                    if (result) {
                        res.status(201).json({
                            message: "Feedback saved",
                            feedback: result,
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
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};

exports.feedback_delete_feedback = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Feedback.remove({
        _id: req.params.feedbackId
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Feedback deleted... Just like Fontys',
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
                url: domain + '/feedback/' + id
            },
            {
                type: 'DELETE',
                url: domain + '/feedback/' + id
            }
        ]
    } else {
        return [
            {
                type: 'GET',
                url: domain + '/feedback/'
            },
            {
                type: 'POST',
                url: domain + '/feedback/',
                data: {
                    'value': {
                        'type': 'Number',
                        'required': true,
                        'max': 1,
                        'min': -1
                    },
                    'location': {
                        'type': 'ObjectId',
                        'ref': 'Location',
                        'required': 'true'
                    }
                }
            }
        ]
    }
}