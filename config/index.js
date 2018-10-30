const Joi = require('joi');
const dbconfig = require('./dbconfig');
require('dotenv').config();

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test'])
        .default('development'),
    PORT: Joi.number()
        .default(4040),
    JWT_SECRET: Joi.string().required()
        .description('JWT Secret required to sign'),
    JWT_EXPIRES_IN: Joi.number().default(1440)
        .description('JWT Expires time in second'),
}).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config Validation Error: ${error.message}`)
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwtSecret: envVars.JWT_SECRET,
    jwtExpiresIn: envVars.JWT_EXPIRES_IN,
};

module.exports = config;
