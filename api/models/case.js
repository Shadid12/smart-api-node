const mongoose = require('mongoose');

const caseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patientId: String,
    nurseId: String,
    patientRequest: Boolean,
    nurseRequest: Boolean,
    approved: Boolean,
    firstName: String,
    lastName: String,
    fromDate: Date,
    toDate: Date,
    notes: String
});

module.exports = mongoose.model('Case', caseSchema);