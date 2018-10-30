const db = require('../models');
const user = db.User;
const bcrypt = require('bcrypt-nodejs');
const httpStatus = require('http-status');
const APIError = require('../helper/APIError');
const _ = require('lodash');

module.exports = {
    getByEmail(email) {
        return user.findOne({
            where: {
                email:email
            },
        });
    },

    getAll(req, res, next) {
        return user.findAll({
            where: {
                isDeleted: 0
            }
        })
            .then(users => res.json(users))
    .catch(e => next(e));
    },

    getProfile(req, res, next) {
        const id = res.locals.session.id;
        return user.findOne({
            where: {
                id: id,
            }
        })
            .then((uniqueUser) => {
            if (uniqueUser) {
                return res.json(uniqueUser);
            }
            const err = new APIError('No such user exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
    })
    },
    getById(req, res, next) {
        return user.findOne({
            where: {
                id: req.params.id,
            }
        })
            .then((uniqueUser) => {
            if (!uniqueUser) {
            const err = new APIError('No such user exists!', httpStatus.NOT_FOUND, true);
            return Promise.reject(err);
        }
        return res.json(uniqueUser);
    })
    },

    update(req, res, next) {
        return user.update({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
            },
            {
                where: {
                    id: req.params.id
                }
            })
            .then((result) => {
            res.json('Updated Successfully');
    })
    .catch(() => {
            return Promise.reject(new APIError('User not found', httpStatus.NOT_FOUND, true));
    })
    },

    deleteUser(req, res, next) {
        return user.update({
            where: {
                id: req.params.id,
            }
        })
            .then((result) => {
            res.send('Record Deleted')
    })
    .catch(() => {
            return Promise.reject(new APIError('User not found', httpStatus.NOT_FOUND, true));
    })
    },

    generatePassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },

    create(userdata) {
        return user.create({
            name: userdata.name,
            email: userdata.email,
            phone: userdata.phone,
            password: userdata.password,
        })
            .then((savedUser) => {
            return savedUser;
    })
    .catch((error) => {
            return Promise.reject(new APIError('Something wrong in Registration', httpStatus.BAD_REQUEST, true));
    })
    }

}