import test from 'ava';
import { assert } from 'chai';
import MQProducer from '../src/producer';
import config from './config';

let producer = null;
test.beforeEach(t => {
  producer = new MQProducer('mns', config['mns']);
});

test('MQProducer:getQueueConsumer', t => {
  assert.isFunction(producer.getQueueProducer);

  const queue = producer.getQueueProducer(config['mns']['queueName']);
  assert.isFunction(queue.getQueueHandler);
});

test('MQProducer:getTopicProducer', t => {
  assert.isFunction(producer.getTopicProducer);

  const topic = producer.getTopicProducer(config['mns']['topicName']);
  assert.isFunction(topic.getTopicHandler);
});
