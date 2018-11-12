const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const faker = require('faker');
const chai = require('chai');
const server = require('../server');

const expect = chai.expect;
chai.config.includeStack=true;

after((done)=>{
   process.exit();
   done();
});

describe('#User APIs', () => {
    let user = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        phone: 8866447433,
        password: faker.internet.password(),
    };
    describe('#POST /api/auth/register', () => {
        it('should create a new user', (done) => {
            request(server)
                .post('/api/auth/register')
                .send(user)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.token).to.not.equal('');
                    expect(res.body.token).to.not.equal(undefined);
                    expect(res.body.name).to.equal(user.name);
                    expect(res.body.email).to.equal(user.email);
                    expect(res.body.phone).to.equal(user.phone);
                    expect(res.body.password).to.equal(undefined);//password should be removed
                    user=res.body;
                    user.token=res.body.token;
                    done();
                })
        })
    });

    describe('#GET /api/users/:id', () => {
        it('should get user details',(done)=>{
            request(server)
                .get(`/api/users/${user.id}`)
                .set({Authorization:`Bearer ${user.token}`})
                .expect(httpStatus.OK)
                .then((res)=>{
                    expect(res.body.email).to.equal(user.email);
                    expect(res.body.name).to.equal(user.name);
                    expect(res.body.phone).to.equal(user.phone);
                    expect(res.body.password).to.equal(undefined);//password should be removed
                    done();
                }).catch(done)
        });

        it('should report error with message - Not found, when user does not exists', (done) => {
            request(server)
                .get('/api/users/0')
                .set({ Authorization: `Bearer ${user.token}` })
                .expect(httpStatus.NOT_FOUND)
                .then((res) => {
                    console.log(res.body.message);
                    expect(res.body.message).to.equal('No such user exists!');
                    done();
                })
                .catch(done);
        });
    });

    describe('#PUT /api/users/:id',() => {
        it('should user get update',(done)=>{
            request(server)
                .put(`/api/users/${user.id}`)
                .set({ Authorization: `Bearer ${user.token}` })
                .send(user)
                .expect(httpStatus.OK)
                .then((res)=>{
                    expect(res.body.message).to.equal('Updated Successfully');
                    done();
                })
                .catch(done);
        })
    });

    describe('# GET /api/users/',()=>{
        it('should get all users',(done)=>{
            request(server)
                .get('/api/users/')
                .set({Authorization:`Bearer ${user.token}`})
                .expect(httpStatus.OK)
                .then((res)=>{
                    expect(res.body).to.be.an('array');
                    done();
                })
        })
    });

    describe('#DELETE /api/users/:id',() => {
        it('should delete user',(done)=>{
            request(server)
                .delete(`/api/users/${user.id}`)
                .set({ Authorization: `Bearer ${user.token}` })
                .expect(httpStatus.OK)
                .then((res)=>{
                    expect(res.body.message).to.equal('User Deleted');
                    done();
                })
                .catch(done);
        })
    })
});
