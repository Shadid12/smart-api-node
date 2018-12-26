const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const checkAuth = require('../middleware/checkAuth');

router.post("/signup", checkAuth, (req, res, next) => {
  User.findById(req.userData.userId)
    .exec()
    .then((incomingUser) => {
        console.log('Incoming User >', incomingUser);
        if(incomingUser.role === 'admin') {
            User.find({ email: req.body.email })
                .exec()
                .then(user => {
                if (user.length >= 1) {
                    return res.status(409).json({
                    message: "Mail exists"
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                        error: err
                        });
                    } else {
                        const user = new User({
                          _id: new mongoose.Types.ObjectId(),
                          email: req.body.email,
                          password: hash,
                          role: req.body.role,
                          firstName: req.body.firstName,
                          lastName: req.body.lastName,
                          ren: req.body.ren
                        });
                        user
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                              message: "User created"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                              error: err
                            });
                        });
                    }
                    });
                }
                });
        }
        else {
            res.status(401).json({
                message: "Not Authorized"
            });
        }
    })
  
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              'Super Secrect Key',
              {
                  expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token,
              role: user[0].role,
              _id: user[0]._id
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});


router.get("/user-info", checkAuth, (req, res, next) => {
  User.findById(req.userData.userId)
    .exec()
    .then((user) => {
      if(!user) {
        return res.status(404).json({
          message: 'User Not Found'
        })
      } 
      return res.status(200).json(
        {
          message: 'Got User Info',
          user: {
            _id: user._id,
            role: user.role,
            email: user.email
          }
        }
      )
    })
})

router.get("/user-profile/:userId", (req, res, next) => {
  User.findById(req.params.userId).exec().then(user => {
    if(!user) {
      return res.status(404).json({
        message: 'User Not Found'
      })
    }
    else {
      return res.status(200).json({
        message: 'Got User Info',
          user: {
            _id: user._id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
          }
      })
    }
  })
})


router.get("/nurses", checkAuth, (req, res, next) => {
  User.findById(req.userData.userId)
    .exec()
    .then((incomingUser) => {
      if(incomingUser.role === 'admin') {
        User.find({role: 'nurse'})
          .exec()
          .then(nurses => {
            res.status(200).json({
              nurses: nurses
            });
          })
      }
      else {
        res.status(401).json({
            message: "Not Authorized"
        });
      }
    })
});


router.get("/patients", (req, res, next) => {
  User.find({ role: "patient" })
    .select("firstName lastName email")
    .exec()
    .then((patients) => {
      res.status(200).json({
        patients: patients
      });
    })
})
  

module.exports = router;