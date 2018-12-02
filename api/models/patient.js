const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patientForm: {}
});

module.exports = mongoose.model('Patient', patientSchema);