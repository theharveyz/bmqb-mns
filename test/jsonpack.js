import test from 'ava';
import jsonpack from 'jsonpack';

test('jsonpack:packAndUnpack', async t => {
  const rawJson = {foo: 'bar', bar: 'foo'};
  const packJson = await jsonpack.pack(rawJson);
  t.deepEqual(await jsonpack.unpack(packJson), rawJson, 'Unpack success!');
  t.true(JSON.stringify(rawJson).length > packJson.length, 'Be compressed!');
});

test('jsonpack:packString', async t => {
  const rawString = 'foo:bar';
  t.throws(() =>{
    jsonpack.pack(rawString);
  }, /Unexpected/);
});
