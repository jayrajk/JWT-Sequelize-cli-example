const express = require('express');
const expressJWT = require('express-jwt');
const config = require('../config/index');
const userRoutes = require('../routes/user.routes');
const authRoutes = require('../routes/auth.routes');
// All the routes are defined here.

const router = express.Router();

router.use('/auth', authRoutes);

// If jwt is valid, storing user data in local session.
router.use((req, res, next) => {
    const authorization = req.header('Authorization');
    if ((authorization === undefined)) {
        next();
    } else {
        res.locals.session = JSON.parse(Buffer.from((authorization.split(' ')[1]).split('.')[1], 'base64').toString()); // eslint-disable-line no-param-reassign
        next();
    }
});

// Load User Routes
router.use('/users', userRoutes);

module.exports = router;