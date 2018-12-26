const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Case = require("../models/case");
const checkAuth = require('../middleware/checkAuth');
const User = require("../models/user");

// Creating Cases
router.post('/',  checkAuth, (req, res, next) => {
    console.log('--->', req.userData.userId);
    User.findById(req.userData.userId).exec().then(user => {
        console.log('A USER', user)
        const newCase = new Case({
            _id: new mongoose.Types.ObjectId(),
            patientId: user._id,
            patientEmail: user.email,
            nurseId: req.body.nurseId,
            patientRequest: req.body.patientRequest,
            nurseRequest: req.body.nurseRequest,
            approved: req.body.approved,
            notes: req.body.notes,
            firstName: user.firstName,
            lastName: user.lastName
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

    }).catch(err => {
        res.status(500).json({
          error: err
        });
    })
    // const newCase = new Case({
    //     _id: new mongoose.Types.ObjectId(),
    //     patientId: req.userData.userId,
    //     patientEmail: req.userData.email,
    //     nurseId: req.body.nurseId,
    //     patientRequest: req.body.patientRequest,
    //     nurseRequest: req.body.nurseRequest,
    //     approved: req.body.approved,
    //     notes: req.body.notes
    // });

    // newCase.save().then(() => {
    //     res.status(201).json({
    //         message: "Case created"
    //     });
    // }).catch(err => {
    //     console.log(err);
    //     res.status(500).json({
    //       error: err
    //     });
    // });
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
router.get('/my', checkAuth, (req, res, next) => {
    Case.find({ nurseId: req.userData.userId }).exec().then((cases) => {
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

// check if current User is requesting care from nurse
router.get('/my/:patientId', checkAuth, (req, res, next) => {
    Case.find({ nurseId: req.userData.userId, patientId: req.params.patientId }).exec().then((cases) => {
        res.status(200).json({
            fetched: 'ok',
            case: cases[0]
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router;
