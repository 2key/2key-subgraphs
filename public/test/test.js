let assert = require('assert');

describe('Environment', function() {
    console.log('Stated env testing');

    describe('Get DB name', function() {
        it('Check DB_NAME exists', function() {
            assert.notEqual(process.env.DB_NAME, null);
        });
    });

    describe('Get DB name', function() {
        it('Check DB_NAME exists', function() {
            assert.notEqual(process.env.DB_NAME, null);
        });
    });
});


describe('Environment', function() {
    console.log('Stated env testing');
    describe('Get DB name', function() {
        it('Check DB_NAME exists', function() {
            assert.notEqual(process.env.DB_NAME, null);
        });
    });
});
