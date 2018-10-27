const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Patient = require("../models/patient");

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    Patient.findById(req.body.productId).then((aPatient) => {
        if(!aPatient) {
            const patient = new Patient({
                _id: mongoose.Types.ObjectId(),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                age: req.body.age,
                allergies: req.body.allergies,
                gender: req.body.gender,
                primary_diagonosis: req.body.primary_diagonosis,
                physician: req.body.physician,
                vitals: req.body.vitals
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

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

module.exports = router;