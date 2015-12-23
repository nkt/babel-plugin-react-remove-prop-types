import path from 'path';
import {readFileSync, readdirSync} from 'fs';
import assert from 'assert';
import {transformFileSync} from 'babel-core';
import reactPlugin from '../src/index';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('remove react propTypes', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  readdirSync(fixturesDir).map((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const expectedPath = path.join(fixtureDir, 'expected.js');

      const actual = transformFileSync(actualPath, {
        plugins: [
          reactPlugin
        ]
      }).code;
      const expected = readFileSync(expectedPath).toString();

      assert.equal(trim(actual), trim(expected));
    });
  });
});
