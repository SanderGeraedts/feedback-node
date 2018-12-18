const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedbackRoutes = require('./api/routes/FeedbackRoutes');
const locationRoutes = require('./api/routes/LocationRoutes');

mongoose.connect('mongodb+srv://sandergeraedts:' + process.env.MONGO_ATLAS_PW + '@feedback-server-yvxom.mongodb.net/test?retryWrites=true',
    {
        useNewUrlParser: true
    }
);

console.log(mongoose);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({
    limit: '50mb'
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }

    next();
});

app.use('/feedback', feedbackRoutes);
app.use('/locations', locationRoutes);


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
        .json({
            error: {
                message: error.message
            }
        });
});

module.exports = app;