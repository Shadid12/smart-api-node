const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: { type: String, default: '' },
    lastname: { type: String, default: '' },
    age: { type: String, default: '' },
    allergies: { type: String, default: '' },
    gender: { type: String, default: '' },
    primary_diagonosis: { type: String, default: '' },
    physician: { type: String, default: '' },
    vitals: {}
});

module.exports = mongoose.model('Patient', patientSchema);