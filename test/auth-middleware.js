const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const authMiddleware = require("../middlewares/is-auth");


describe('Auth Middleware', () => {
    it("Should throw an error if no authorization header is present", () => {
        const req = {
            get: function () { return null }
        }
        // Passing reference to middleware with .bind
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated');
    });

    it("Should throw an error if authorization header is only one string", () => {
        const req = {
            get: function () { return 'xyz' }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
    });

    it('Should throw an error if token cannot be verified', () => {
        const req = {
            get: function () { return 'Bearer xyz' }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();

    })

    it('Should yield a userId after decoding the token', () => {
        const req = {
            get: function () { return 'Bearer sbdsfjlafdd' }
        }
        // Creating stub - replaces a method
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'abc' });

        authMiddleware(req, {}, () => { });

        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        // Restoring original
        jwt.verify.restore();
    })
})


