const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadArrayFn(file) {
    const source = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
    return vm.runInNewContext(source + '\nArrayFn');
}

function normalize(value) {
    return JSON.parse(JSON.stringify(value));
}

function assertRangeError(fn) {
    assert.throws(fn, function (error) {
        return error.name === 'RangeError' && error.message === 'size must be a positive integer';
    });
}

function runSuite(file) {
    const ArrayFn = loadArrayFn(file);
    const array = new ArrayFn();
    const input = [1, 2, 3, 4, 5];
    const nested = {};

    assert.deepStrictEqual(normalize(array.chunk(input, 2)), [[1, 2], [3, 4], [5]]);
    assert.deepStrictEqual(normalize(array.chunk([], 1)), []);
    assert.deepStrictEqual(normalize(array.chunk([1, 2], 1)), [[1], [2]]);
    assert.deepStrictEqual(normalize(array.chunk([1, 2], 3)), [[1, 2]]);
    assert.deepStrictEqual(input, [1, 2, 3, 4, 5]);
    assert.notStrictEqual(array.chunk(input, 10)[0], input);
    assert.strictEqual(array.chunk([nested], 1)[0][0], nested);

    assert.throws(function () {
        array.chunk('not an array', 1);
    }, function (error) {
        return error.name === 'TypeError' && error.message === 'arr must be an array';
    });

    [undefined, null, 0, -1, 1.5, NaN, Infinity, '2'].forEach(function (size) {
        assertRangeError(function () {
            array.chunk(input, size);
        });
    });
}

runSuite('js/array.js');
runSuite('js/index.js');
