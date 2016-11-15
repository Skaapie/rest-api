'use strict';

process.env.NODE_ENV = 'test';

let models = require('../models');
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);


let server = require('../app');

describe('/users', () => {
  beforeEach((done) => { //Before each test we empty the database
      models.syncDB().then(() => {
        done();
      });
  });

  describe('/GET', () => {
    it('should succeed', (done) => {
      chai.request(server)
          .get('/users')
          .set('Content-Type', 'application/json')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(0);
              done();
          });
    });
  });

  describe('/POST', () => {

    it('should fail without email', (done) => {
      let user = {};
      chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors[0].should.eql('Email is required.');
            done();
          });
    });
    it('should fail with blank email', (done) => {
      let user = {
        email: ''
      };
      chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors[0].should.eql('Email is required.');
            done();
          });
    });
    it('should fail with null email', (done) => {
      let user = {
        email: null
      };
      chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors[0].should.eql('Email is required.');
            done();
          });
    });
    it('should fail with invalid email and valid password ', (done) => {
      let user = {
          email: 'invalidemail.com',
          password: 'asdasd'
      };
      chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors[0].should.eql('Email format invalid.');

            done();
          });
    });

    it('should fail without password', (done) => {
      let user = {
          email: 'asd@asd.com'
      };
      chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors[0].should.eql('Password is required.');
            done();
          });
    });
    it('should fail with blank password', (done) => {
      let user = {
          email: 'asd@asd.com',
          password: ''
      };
      chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors[0].should.eql('Password is required.');
            done();
          });
    });
    it('should fail with null password', (done) => {
      let user = {
          email: 'asd@asd.com',
          password: null
      };
      chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors[0].should.eql('Password is required.');
            done();
          });
    });

    it('should succeed with email and password ', (done) => {
      let user = {
          email: 'asd@asd.com',
          password: 'asdasd'
      };
      chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.have.property('id');
            res.body.should.have.property('email');
            res.body.should.have.property('role');
            // Make sure there are not any fiedls we don't want such as:
            // verifyToken, password, password_hash.
            Object.keys(res.body).length.should.eql(3);

            done();
          });
    });
    it('should fail with a duplicate email', (done) => {
      let user = {
          email: 'asd@asd.com',
          password: 'asdasd'
      };

      models.User.create(user).then((dbUser) => {
        chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {

            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors[0].should.eql('A user with that email already exists.');

            done();
          });
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('/DELETE', () => {
    let newUser = undefined;
    beforeEach((done) => {
      let user = {
        email: 'asd@asd.com',
        password: 'asdasd'
      };
      models.User.create(user).then((dbUser) => {
        newUser = dbUser.get({ plain: true });
        // console.log('Created user in db: ', dbUser.get({ plain: true }));
        done();
      });
    });

    it('/:id - should fail without :id', (done) => {
      chai.request(server)
        .delete(`/users/`)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });
    it('/:id - should fail without a VALID UUID :id', (done) => {
      let invalidId = 'something-invalid';
      chai.request(server)
        .delete(`/users/${invalidId}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors[0].should.eql('User id not a valid format.');

          done();
        });
    });
    it('/:id - should fail with :id that does not exist', (done) => {
      let nonExistant = 'aaa8f0c0-baf4-40b5-9da5-cdfe2289a33a';
      chai.request(server)
        .delete(`/users/${nonExistant}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors[0].should.eql(`User with id '${nonExistant}' does not exist.`);

          done();
        });
    });
    it('/:id - should succeed with :id that exists', (done) => {

      chai.request(server)
        .delete(`/users/${newUser.id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.eql('User successfully deleted.');

          // Try retrieve the user to validate it is deleted.
          chai.request(server)
            .delete(`/users/${newUser.id}`)
            .end((err, res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors[0].should.eql(`User with id '${newUser.id}' does not exist.`);

              done();
            });
        });
    });
  });

});