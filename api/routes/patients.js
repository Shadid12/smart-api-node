const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Patient = require("../models/patient");

router.get('/', (req, res, next) => {
    Patient.find().exec().then((patients) => {
        res.status(200).json({
            count: patients.length,
            patients:  patients
        })
    })
});

router.post('/', (req, res, next) => {
    Patient.findById(req.body.productId).then((aPatient) => {
        if(!aPatient) {
            const patient = new Patient({
                _id: mongoose.Types.ObjectId(),
                patientForm: req.body.formFormat
            });
            return patient.save();
        }
    }).then(newPatient => {
        res.status(201).json({
            message: "Created",
            newPatient: newPatient
        });
    }).catch(err => {
        console.log('ERROR--->', err);
        res.status(500).json({
          error: err
        });
    });
});

router.get('/:patientId', (req, res, next) => {
    Patient.findById(req.params.patientId).exec().then((aPatient) => {
        if (!aPatient) {
            return res.status(404).json({
              message: "Patient not found"
            });
        }

        res.status(200).json({
            patient: aPatient,
        });
    
    }).catch(err => {
        res.status(500).json({
          error: err
        });
    });
});


router.patch('/:orderId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = req.body

    Patient.update({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Patient updated',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
        });

});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

module.exports = router;
