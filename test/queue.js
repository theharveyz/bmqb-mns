import test from 'ava';
import { assert } from 'chai';
import { Account, MQ } from 'ali-mns';
import _ from 'lodash';
import Queue from '../src/queue';
import MQMsg from '../src/mq_msg';
import MNSAdapter from '../src/queue/adapter/mns';
import config from './config';

let queue = null;
test.beforeEach(t => {
  queue = new Queue('mns', config['mns']);
});

test('Queue:mnsAdapter', t => {
  t.true(queue.hasOwnProperty('config', 'Has property config'));
  t.true(queue instanceof MNSAdapter);
});

test('Queue:mnsAdapter:getAccount', t => {
  assert.isFunction(queue.getAccount);
  t.true(queue.getAccount() instanceof Account);
});

test('Queue:mnsAdapter:getQueueHandler', t => {
  assert.isFunction(queue.getQueueHandler);
  t.true(queue.getQueueHandler() instanceof MQ);
});

test('Queue:mnsAdapter:pushMsg:content:null', t => {
  assert.isFunction(queue.pushMsg);
  const msg = null;
  const errPromise = queue.pushMsg(msg);
  t.true(errPromise instanceof Promise);
  errPromise.catch(err => {
    assert.throws(() => {
      throw err;
    }, /msg must be a MQMsg Object/);
  });

  const deleteRes = queue.deleteMsg(msg);
  t.true(deleteRes instanceof Promise);
  deleteRes.catch(err => {
    assert.throws(() => {
      throw err;
    }, /msg must be a MQMsg Object/);
  });

});

test('Queue:mnsAdapter:pushMsg|popMsg|deleteMsg:content:json', t => {
  const content = {
    foo: 'bar',
  };
  const msg = new MQMsg({
    content,
  });
  queue.pushMsg(msg)
  .then(data => {
    console.log(data);
    t.true(data instanceof MQMsg);
    assert.deepEqual(data.getMsgContent(), content);
    assert.isNotNull(data.getId());
  }).catch(err => {
    // 返回一个错误对象
    t.true(err.hasOwnProperty('Error'));
    t.true(err.Error.hasOwnProperty('Code'));
  });

  try {
    queue.popMsg((err, message) => {
      console.log(message);
      (async () => {
        try {
          t.true(message instanceof MQMsg);
          t.deepEqual(message.getMsgContent(), content, 'The content of message be equal json:content');
          // deleteMsg
          await queue.deleteMsg(message);
        } catch (err) {
          console.log(err);
        }
      })();
    });
  } catch (err) {
    // 返回一个错误对象
    t.true(err.hasOwnProperty('Error'));
    t.true(err.Error.hasOwnProperty('Code'));
  }

});

test('Queue:mnsAdapter:popMsg|pushMsg:accessError', async t => {
  const content = {
    foo: 'bar',
  };
  const msg = new MQMsg({
    content,
  });
  let errorMnsConfig = {
    accountId: 'xxxxxx',
    accessKey: 'xxxxxx',
    secretKey: 'xxxxxx',
  };
  errorMnsConfig = _.merge(config['mns'], errorMnsConfig);
  const errQueue = new Queue('mns', errorMnsConfig);

  errQueue.pushMsg(msg).catch(err => {
    // 返回一个错误对象
    t.true(err.hasOwnProperty('Error'));
    t.true(err.Error.hasOwnProperty('Code'));
  });

  try {
    await errQueue.popMsg(() => {});
  } catch (err) {
    // 返回一个错误对象
    t.true(err.hasOwnProperty('Error'));
    t.true(err.Error.hasOwnProperty('Code'));
  }

});

