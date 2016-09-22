import _ from 'lodash';

const priorityMapping = {
  mns: {
    low: 2,
    normal: 8,
    high: 12,
    critical: 16,
  },
};

const msgMeta = {
  id: null,
  msg: {
    adapter: 'mns',
    delay: 0,
    priority: 'normal',
    content: null,
  },
  enqueueTime: 0, // 入队列时间
  nextVisibleTime: 0, // 下次可见时间
  rawMsg: null,
};

export default class MQMsg {
  constructor({
    content,
    delay = 0,
    priority = 'normal',
    adapter = 'mns',
  }) {
    if (!content) {
      throw new Error('content donot be empty!');
    }
    if (!adapter || !(adapter in priorityMapping)) {
      throw new Error('Donot support this adapter!');
    }
    const priorityOptions = priorityMapping[adapter];
    if (!(priority in priorityOptions)) {
      throw new Error('Donot support this priority!');
    }
    if (!isFinite(delay)) {
      throw new Error('Argument delay must be an Integer!');
    }
    const msg = {
      adapter,
      delay: delay <= 604800 && delay >= 0 ? delay : 0,
      priority,
      content,
    };
    this.data = _.merge({}, msgMeta);
    this.data.msg = _.merge(this.data.msg, msg);
  }

  setId(id) {
    if (_.isEmpty(id)) {
      throw new Error('Invalid id!');
    }
    this.data.id = id;
  }

  getId() {
    return this.data.id;
  }

  setEnqueueTime(time) {
    if (!isFinite(time)) {
      throw new Error('Invalid enqueueTime!');
    }
    this.data.enqueueTime = parseInt(time, 0);
  }

  getEnqueueTime() {
    return this.data.enqueueTime;
  }

  setNextVisibleTime(time) {
    if (!isFinite(time)) {
      throw new Error('Invalid nextVisibleTime!');
    }
    this.data.nextVisibleTime = time;
  }

  getNextVisibleTime() {
    return this.data.nextVisibleTime;
  }

  getMsg() {
    return this.data.msg;
  }

  getMsgContent() {
    return this.data.msg.content;
  }

  setRawMsg(rawMsg) {
    this.data.rawMsg = rawMsg;
  }

  getRawMsg() {
    return this.data.rawMsg;
  }

  getDelay() {
    return this.data.msg.delay;
  }

  getPriority() {
    return this.data.msg.priority;
  }
}
