import test from 'ava';
import { assert } from 'chai';
import MQConsumer from '../src/consumer';
import config from './config';

test('MQConsumer:getQueueConsumer', t => {
  const consumer = new MQConsumer('mns', config['mns']);
  assert.isFunction(consumer.getQueueConsumer);

  const queue = consumer.getQueueConsumer(config['mns']['queueName']);
  assert.isFunction(queue.getQueueHandler);
});
