const assert = require('assert');
const filter = require('../lib/filterUserInfo');

const unparsed = [
      {
        username: 'John',
        _id: '12345',
        exercise: 'pullup'
      },
      {
        username: 'Sarah',
        _id: '56145',
        exercise: 'lunge'
      },
      {
        username: 'Frank',
        _id: '12325',
        exercise: 'chinup'
      }
    ];

const expected =  [
      {
        username: 'John',
        _id: '12345'
      },
      {
        username: 'Sarah',
        _id: '56145'
      },
      {
        username: 'Frank',
        _id: '12325'
      }
    ];

describe('filterByNameAndId.js', () => {
  
  it('returns a parsed version of the array with only username and _id.', () => {  
    const parsed = filter(unparsed);
    
    assert.deepEqual(parsed, expected);
  });
  
  it('throws an Error when given an empty array.', () => {  
    assert.throws(() => {
      return filter([]);
    }, Error);
  });
  
});