const expect = require('chai').expect;
const sinon = require('sinon');

const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', function () {
    // Runs once before all test cases
    before(function (done) {
        mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.4uhxiz2.mongodb.net/${process.env.MONGO_TEST_DB}?retryWrites=true&w=majority`)
            .then((result) => {
                // Create dummy user
                const user = new User({
                    email: "test@test.com",
                    password: "124567",
                    name: "Test",
                    posts: [],
                    _id: '63f00d80b76e9edf2d2d86e2'
                });
                return user.save();
            }).then(() => done())
    })

    // Runs before every test case(it function call)
    beforeEach(function () {
    })

    // Runs after every test case
    afterEach(function () {
    })

    it('Should throw an error with code 500 if accessing the database fails', function (done) {
        // Create a stub of user model
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: { email: "test@test.com", password: "12345" }
        }

        // Async function
        AuthController.login(req, {}, () => { }).then((result) => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);

            // Call in async function call
            done();
        });

        // Restore original
        User.findOne.restore();
    })

    it('Should send a response with a valid user status for an existing user', function (done) {
        // Recreate req and res objects
        const req = { userId: '63f00d80b76e9edf2d2d86e2' };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code; return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            }
        }

        // Expectations
        AuthController.getStatus(req, res, () => { }).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new');
            // End async process
            done();
        });
    });

    after(function (done) {
        // Cleans up db
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect()
            })
            .then(() => done());
    })
})
