const expect = require('chai').expect;

const mongoose = require('mongoose');

const User = require('../models/user');

const FeedController = require('../controllers/feed');

describe('Feed Controller', function () {
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

    it('Should add a created post to the posts of the creator', function (done) {
        const req = {
            body: {
                title: "Test Post",
                content: "This is a test post",
            },
            file: {
                path: 'abc'
            },
            userId: "63f00d80b76e9edf2d2d86e2"
        }

        const res = {
            status: function () { return this; },
            json: function () { }
        }

        // Async function
        FeedController.createPost(req, res, () => { })
            .then((savedUser) => {
                expect(savedUser).to.have.property('posts');
                expect(savedUser.posts).to.have.length(1);
                done();
            })
            .catch((err) => console.log('err', err));
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
