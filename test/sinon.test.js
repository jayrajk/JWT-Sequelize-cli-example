const sinon = require('sinon');
var spy = sinon.spy();
var stub = sinon.stub();
const assert = require('assert');

var clock;

before(function () { clock = sinon.useFakeTimers(); });
after(function () { clock.restore(); });

function once(fn) {
    var returnValue, called = false;
    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }
        return returnValue;
    };
}

it('calls the original function', function () {
    var callback = sinon.fake();
    var proxy = once(callback);

    proxy();

    assert(callback.called);
});

it('calls the original function only once', function () {
    var callback = sinon.fake();
    var proxy = once(callback);

    proxy();
    proxy();

    assert(callback.calledOnce);

});

it('calls original function with right this and args', function () {
    var callback = sinon.fake();
    var proxy = once(callback);
    var obj = {};

    proxy.call(obj, 1, 2, 3);

    assert(callback.calledOn(obj));
    assert(callback.calledWith(1, 2, 3));
});

it("returns the return value from the original function", function () {
    var callback = sinon.fake.returns(42);
    var proxy = once(callback);

    assert.equal(proxy(), 42);
});

