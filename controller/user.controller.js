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
        })
    },

    getAll(req, res, next) {
        return user.findAll({
            attributes:{
                exclude: ['password','createdAt', 'updatedAt']
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
            },
            attributes:{
                exclude: ['password','createdAt', 'updatedAt']
            }
        })
        .then((uniqueUser) => {
            if (uniqueUser) {
                return res.json(uniqueUser);
            }
            return res.status(httpStatus.NOT_FOUND).send({message:'No such user exists!'})
        })
    },

    getById(req, res, next) {
        return user.findOne({
            where: {
                id: req.params.id,
            },
            attributes:{
                exclude:['createdAt','updatedAt','password']
            }
        })
        .then((uniqueUser) => {
            if (!uniqueUser) {
            return res.status(httpStatus.NOT_FOUND).send({message:'No such user exists!'})
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
            if(result) {
                return res.status(200).send({message: "Updated Successfully", data: result});
            }else{
                return res.status(httpStatus.BAD_REQUEST).send('Error while updating');
            }
        })
        .catch(() => {
            return res.status(httpStatus.NOT_FOUND).send('User not found');
        })
    },

    deleteUser(req, res, next) {
        return user.destroy({
            where: {
                id: req.params.id,
            }
        })
        .then((result) => {
            return res.status(200).send({message:'User Deleted'});
        })
        .catch(() => {
            return res.status(httpStatus.NOT_FOUND).send('User not found');
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
            return res.status(httpStatus.BAD_REQUEST).send('Something wrong in Registration');
        })
    }

}