const mongoose = require('mongoose');

const formSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    org_id: { type: String, default: '' },
    formFormat: {}
});

module.exports = mongoose.model('Form', formSchema);