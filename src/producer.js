import _ from 'lodash';
import Queue from './queue';
import Topic from './topic';

export default class MQProducer {
  constructor(adapter, config) {
    if (!adapter) {
      throw new Error('adapter should not be empty');
    }
    if (!_.isObject(config)) {
      throw new Error('invalid config');
    }
    this.adapter = adapter;
    this.config = config;
  }

  getQueueProducer(queueName) {
    if (!queueName) {
      throw new Error('invalid queueName!');
    }
    const queueConfig = _.merge(this.config, {
      queueName,
    });
    return new Queue(this.adapter, queueConfig);
  }

  getTopicProducer(topicName) {
    if (!topicName) {
      throw new Error('invalid topicName!');
    }
    const topicConfig = _.merge(this.config, {
      topicName,
    });
    return new Topic(this.adapter, topicConfig);
  }
}
