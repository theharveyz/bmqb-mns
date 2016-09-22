import test from 'ava';
import { assert } from 'chai';
import { Account, Topic } from 'ali-mns';
import BMQBTopic from '../src/topic';
import MQMsg from '../src/mq_msg';
import MNSAdapter from '../src/topic/adapter/mns';
import config from './config';

let topic = null;
test.beforeEach(t => {
  topic = new BMQBTopic('mns', config['mns']);
});

test('Topic:mnsAdapter', t => {
  t.true(topic.hasOwnProperty('config', 'Has property config'));
  t.true(topic instanceof MNSAdapter);
});

test('Topic:mnsAdapter:getAccount', t => {
  assert.isFunction(topic.getAccount);
  t.true(topic.getAccount() instanceof Account);
});

test('Topic:mnsAdapter:getTopicHandler', t => {
  assert.isFunction(topic.getTopicHandler);
  t.true(topic.getTopicHandler() instanceof Topic);
});

test('Topic:mnsAdapter:publishMsg:content:null', t => {
  assert.isFunction(topic.publishMsg);
  const msg = null;
  const errPromise = topic.publishMsg(msg);
  t.true(errPromise instanceof Promise);
  errPromise.catch(err => {
    assert.throws(() => {
      throw err;
    }, /msg must be a MQMsg Object/);
  });
});

test('Topic:mnsAdapter:publishMsg:content:json', t => {
  const content = {
    foo: 'bar',
  };
  const msg = new MQMsg({
    content,
  });
  topic.publishMsg(msg)
  .then(data => {
    t.true(data instanceof MQMsg);
    assert.deepEqual(data.getMsgContent(), content);
    assert.isNotNull(data.getId());
  }).catch(err => {
    console.log(err);
    // 返回一个错误对象
    t.true(err.hasOwnProperty('Error'));
    t.true(err.Error.hasOwnProperty('Code'));
  });
});
