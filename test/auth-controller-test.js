'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';
const debug = require('debug')('shooter:authcontroller-test');

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');

const authController = require('../controller/auth-controller');

const port = process.env.PORT || 3000;
const server = require('../server');
request.use(superPromise);



describe('testing the auth-controller signIn method ', function(){
  before((done) => {
    debug('before-block-signin-test');
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server up on port:', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('after-block-signin-test');
    if(server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        console.log('server is down');
        done();
      });
      return;
    }
    done();
  });

  describe('testing signIn method with valid request', function(){
    before((done) => {
      debug('GET-sigin-before-block');
      authController.newUser({username: 'tester', password: 'openSaysMe!'})
      .then(() => done())
      .catch(done);
    });

    after((done) => {
      debug('GET-sigin-after-block');
      authController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a token', function(done) {
      debug('GET-signin-valid-test');
      authController.signIn({username: 'tester', password: 'openSaysMe!'})
      .then(res => {
        console.log('res.status  ', res.status);
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      })
      .catch(done);
    });
  });


  describe('testing signIn method with incorrect username or password', function(){
    before((done) => {
      debug('GET-sigin-before-block');
      authController.newUser({username: 'tester', password: 'openSaysMe!'})
      .then(() => done())
      .catch(done);
    });
    after((done) => {
      debug('GET-sigin-after-block');
      authController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a 404 error', function(done) {
      debug('GET-signin-valid-test');
      authController.signIn({username: 'noSuchUserName', password: 'openSaysMe!'})
      .then(done)
      .catch(err =>  {
        const res = err.response;
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('not found');
        done();
      })
      .catch(done);
    });
  });


  describe('testing signIn method with missing username', function(){
    before((done) => {
      debug('GET-sigin-before-block');
      authController.newUser({username: 'tester', password: 'openSaysMe!'})
      .then(() => done())
      .catch(done);
    });
    after((done) => {
      debug('GET-sigin-after-block');
      authController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a 400 error', function(done) {
      debug('GET-signin-valid-test');
      authController.signIn({username: '', password: 'openSaysMe!'})
      .then(done)
      .catch(err =>  {
        const res = err.response;
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('not found');
        done();
      })
      .catch(done);
    });
  });


});
