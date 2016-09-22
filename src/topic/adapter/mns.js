import { Account, Topic } from 'ali-mns';
import jsonpack from 'jsonpack';
import MQMsg from '../../mq_msg';

export default class MNSAdapter {
  constructor({
    accountId,
    accessKey,
    secretKey,
    topicName,
    region = 'hangzhou',
  }) {
    if (!accessKey || !secretKey || !accountId) {
      throw new Error('invalid arguments');
    }
    this.config = {
      accountId,
      accessKey,
      secretKey,
      topicName,
      region,
    };
  }

  getAccount() {
    if (this.account) {
      return this.account;
    }
    this.account = new Account(this.config.accountId,
      this.config.accessKey, this.config.secretKey);
    return this.account;
  }

  getTopicHandler() {
    if (this.topicHandler) {
      return this.topicHandler;
    }
    this.topicHandler = new Topic(this.config.topicName,
      this.getAccount(), this.config.region);
    return this.topicHandler;
  }

  /**
   * @params msg {MQMsg} 支持字符串、json格式 // 暂时不支持延时等
   */
  publishMsg(msg) {
    return Promise.resolve().then(() => {
      if (!(msg instanceof MQMsg)) {
        throw new Error('msg must be a MQMsg Object!');
      }
      return this.getTopicHandler().publishP(jsonpack.pack(msg.getMsg()))
      .then(message => {
        msg.setId(message.Message.MessageId);
        return msg;
      });
    });
  }
}
