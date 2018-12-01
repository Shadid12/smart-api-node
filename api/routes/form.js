const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Form = require("../models/form");

const checkAuth = require('../middleware/checkAuth');


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

// Get all the forms
router.get('/', (req, res, next) => {
    Form.find().exec().then((forms) => {
        res.status(200).json({
            count: forms.length,
            forms:  forms
        })
    })
});

// Get Form by id
router.get('/:formId', (req, res, next) => {
    Form.findById(req.params.formId).exec().then((aForm) => {
        if (!aForm) {
            return res.status(404).json({
              message: "Patient not found"
            });
        }

        res.status(200).json({
            forms: aForm,
        });
    
    }).catch(err => {
        res.status(500).json({
          error: err
        });
    });
});


router.patch("/:formId", (req, res, next) => {
    const id = req.params.formId;
    Form.update({ _id: id }, {formFormat: req.body.formFormat })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'ok',
                request: {
                    type: 'GET',
                    result
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;