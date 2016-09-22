import _ from 'lodash';
import Queue from './queue';

export default class MQConsumer {
  constructor(adapter, config) {
    if (!adapter) {
      throw new Error('adapter should not be empty');
    }
    if (!_.isObject(config)) {
      throw new Error('invalid config');
    }
    this.config = config;
    this.adapter = adapter;
  }

  getQueueConsumer(queueName) {
    if (!queueName) {
      throw new Error('invalid queueName!');
    }
    const queueConfig = _.merge(this.config, {
      queueName,
    });
    return new Queue(this.adapter, queueConfig);
  }
}
