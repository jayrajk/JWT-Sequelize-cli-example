const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const helmet = require('helmet');
const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const routes = require('./routes/routes');
const methodOverride = require('method-override');
const APIError = require('./helper/APIError');
const app = express();
const http = require('http');
const server = http.createServer(app);

if (config.env === 'development') {
    app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(methodOverride());
app.use(cors());

app.use('/api', routes);

app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
        // validation error contains errors which is an array of error each containing message[]
        const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
        const error = new APIError(unifiedErrorMessage, err.status, true);
        return next(error);
    } else if (!(err instanceof APIError)) {
        const apiError = new APIError(err.message, err.status, err.name === 'UnauthorizedError' ? true : err.isPublic);
        return next(apiError);
    }
    return next(err);
});

app.use((req, res, next) => {
    const err = new APIError('API Not Found', httpStatus.NOT_FOUND, true);
    return next(err);
});

app.use((err, req, res, next) => {
        res.status(err.status).json({
            message: err.isPublic ? err.message : httpStatus[err.status],
            stack: config.env === 'development' ? err.stack : {},
        })
    }
);

server.listen(4000,()=> console.log('Server started on 4000 port'));

module.exports = server;