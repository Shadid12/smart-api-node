const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Form = require("../models/form");


// Create new Form
router.post('/', (req, res, next) => {
    Form.findById(req.body.productId).then((aForm) => {
        if(!aForm) {
            const theForm = new Form({
                _id: mongoose.Types.ObjectId(),
                org_id: req.body.org_id,
                formFormat: req.body.formFormat
            });
            return theForm.save();
        }
    }).then(newSchema => {
        res.status(201).json({
            message: "Created",
            newSchema: newSchema
        });
    }).catch(err => {
        console.log('ERROR--->', err);
        res.status(500).json({
          error: err
        });
    });
});


module.exports = router;