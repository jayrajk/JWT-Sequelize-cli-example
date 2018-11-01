const express = require('express');
const expressJWT = require('express-jwt');
const config = require('../config/index');
const userRoutes = require('../routes/user.routes');
const authRoutes = require('../routes/auth.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger');
// All the routes are defined here.

const router = express.Router();

// router.get('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
router.use('/api-paths',swaggerUi.serve,swaggerUi.setup(swaggerDocument));

router.use('/auth', authRoutes);

//validating all the APIs with jwt token.
router.use(expressJWT({secret:config.jwtSecret}));

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