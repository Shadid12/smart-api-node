const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");

const checkAuth = require('../middleware/checkAuth');

router.get('/', (req, res, next) => {
    Patient.find().exec().then((patients) => {
        res.status(200).json({
            count: patients.length,
            patients:  patients
        })
    })
});



// Creating Patients
router.post('/', (req, res, next) => {
    Patient.find({ email : req.body.email })
    .exec()
    .then((patient) => {
        if (patient.length >= 1) {
            return res.status(409).json({
            message: "Mail exists"
            });
        } 
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => { 
                if (err) {
                    return res.status(500).json({
                    error: err
                    });
                }
                else {
                    const newPatient = new Patient({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        patientForm: req.body.formFormat
                    });

                    newPatient.save().then((result) => {
                        console.log(result);
                        res.status(201).json({
                            message: "Patient created"
                        });
                    })
                }
            });
        }
    })
});

// Loggin in Patients
router.post("/login", (req, res, next) => {
    Patient.find({ email: req.body.email })
    .exec()
    .then((patient) => {
        if (patient.length < 1) {
            return res.status(401).json({
              message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, patient[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                  message: "Auth failed"
                });
            }

            if (result) {
                const token = jwt.sign(
                  {
                    email: patient[0].email,
                    patientId: patient[0]._id
                  },
                  'Super Secrect Key',
                  {
                      expiresIn: "1h"
                  }
                );
                return res.status(200).json({
                  message: "Auth successful",
                  token: token,
                  role: 'patient'
                });
            }
        })

    })
});


router.get('/info', checkAuth,  (req, res, next) => {
    Patient.findById(req.userData.patientId).exec().then((aPatient) => {
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
