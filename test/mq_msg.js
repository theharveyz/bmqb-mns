import test from 'ava';
import { assert } from 'chai';
import MQMsg from '../src/mq_msg';

let mqMsgMeta = {};
test.beforeEach(t => {
  mqMsgMeta = {
    content: {foo: 'bar'},
    delay: 0,
    priority: 'high',
    adapter: 'mns',
  };
});
test('MQMsg:createMQMsg', t => {
  const msg = new MQMsg(mqMsgMeta);
  assert.instanceOf(msg, MQMsg, 'msg is an MQMsg object');
  assert.deepEqual(msg.getMsg(), mqMsgMeta);
  assert.deepEqual(msg.getMsgContent(), mqMsgMeta.content);
  assert.equal(msg.getDelay(), mqMsgMeta.delay);
  assert.equal(msg.getPriority(), mqMsgMeta.priority);

  const id = '1a';
  msg.setId(id);
  assert.equal(msg.getId(), id);

  const enqueueTime = '10000';
  const nextVisibleTime = '10000';
  msg.setEnqueueTime(enqueueTime);
  msg.setNextVisibleTime(nextVisibleTime);

  assert.equal(msg.getEnqueueTime(), parseInt(enqueueTime));
  assert.equal(msg.getNextVisibleTime(), parseInt(nextVisibleTime));

  const rawMsg = {foo: 'raw'};
  msg.setRawMsg(rawMsg);
  assert.deepEqual(msg.getRawMsg(), rawMsg);
});

test('MQMsg:content:exceptions', async t => {
  mqMsgMeta.content = null;
  assert.throws(()=> {
    return new MQMsg(mqMsgMeta);
  }, 'content donot be empty!');
});

test('MQMsg:adapter:exceptions', async t => {
  mqMsgMeta.adapter = 'foo';
  assert.throws(()=> {
    return new MQMsg(mqMsgMeta);
  }, 'Donot support this adapter!');
});

test('MQMsg:priority:exceptions', async t => {
  mqMsgMeta.priority = 'foo';
  assert.throws(()=> {
    return new MQMsg(mqMsgMeta);
  }, 'Donot support this priority!');
});

test('MQMsg:delay:exceptions', async t => {
  mqMsgMeta.delay = 'xxx';
  assert.throws(()=> {
    return new MQMsg(mqMsgMeta);
  }, 'Argument delay must be an Integer!');
});
