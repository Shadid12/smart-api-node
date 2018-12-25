const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Case = require("../models/case");

// Creating Cases
router.post('/', (req, res, next) => {
    const newCase = new Case({
        _id: new mongoose.Types.ObjectId(),
        patientId: req.body.patientId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nurseId: req.body.nurseId,
        patientRequest: req.body.patientRequest,
        nurseRequest: req.body.nurseRequest,
        approved: req.body.approved
    });

    newCase.save().then(() => {
        res.status(201).json({
            message: "Case created"
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
    });
});


// Get all cases
router.get('/', (req, res, next) => {
    Case.find({nurseId: ''}).exec().then((cases) => {
        res.status(200).json({
            fetched: 'ok',
            cases: cases
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

// Get Cases by nurseId
router.get('/:nurseId', (req, res, next) => {
    Case.find({ nurseId: req.params.nurseId }).exec().then((cases) => {
        res.status(200).json({
            fetched: 'ok',
            cases: cases
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router;
