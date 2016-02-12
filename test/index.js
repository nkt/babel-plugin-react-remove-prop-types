import fs from 'fs';
import path from 'path';
import assert from 'assert';
import {transformFileSync} from 'babel-core';
import plugin from '../src';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('Babel plugin React remove PropTypes', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    const fixtureDir = path.join(fixturesDir, caseName);
    const actualPath = path.join(fixtureDir, 'actual.js');
    const expectedPath = path.join(fixtureDir, 'expected.js');

    it(`should ${caseName.split('-').join(' ')}`, () => {
      const actual = transformFileSync(actualPath, {
        ast: false,
        babelrc: false,
        plugins: [
          require('babel-plugin-transform-class-properties'),
          require('babel-plugin-syntax-jsx'),
          plugin
        ]
      }).code;

      const expected = fs.readFileSync(expectedPath).toString();

      assert.equal(trim(actual), trim(expected));
    });
  });
});
