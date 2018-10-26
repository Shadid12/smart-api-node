const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));

const patientsRoutes = require('./api/routes/patients');
app.use('/patients', patientsRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((req, res, next) => {
    res.status(200).json({
        message: 'It works!'
    });
});

module.exports = app;