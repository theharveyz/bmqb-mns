import { Account, MQ } from 'ali-mns';
import jsonpack from 'jsonpack';
import MQMsg from '../../mq_msg';

export default class MNSAdapter {
  constructor({
    accountId,
    accessKey,
    secretKey,
    queueName,
    region = 'hangzhou',
  }) {
    if (!accessKey || !secretKey || !accountId) {
      throw new Error('invalid arguments');
    }
    if (!queueName) {
      throw new Error('invalid queueName');
    }

    this.config = {
      accountId,
      accessKey,
      secretKey,
      queueName,
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

  getQueueHandler() {
    if (this.queueHandler) {
      return this.queueHandler;
    }
    this.queueHandler = new MQ(this.config.queueName, this.getAccount(), this.config.region);
    return this.queueHandler;
  }

  /**
   * @params msg {MQMsg} 支持字符串、json格式
   * @params delay {Integer} 延迟时间（不得大于7天，单位s）
   * @params priority {String} 优先级 0-16，默认为8
   */
  pushMsg(msg) {
    return Promise.resolve().then(() => {
      if (!(msg instanceof MQMsg)) {
        throw new Error('msg must be a MQMsg Object!');
      }
      return this.getQueueHandler().sendP(jsonpack.pack(msg.getMsg()),
          msg.getPriority(), msg.getDelay())
        .then(message => {
          msg.setId(message.Message.MessageId);
          return msg;
        });
    });
  }

  popMsg(callback) {
    return this.getQueueHandler().notifyRecv((err, message) => {
      if (err) {
        callback(err);
      } else {
        let msgMeta = '';
        if (message && 'Message' in message) {
          try {
            msgMeta = message.Message.MessageBody;
            msgMeta = jsonpack.unpack(msgMeta);
            // 设置msg
            const msg = new MQMsg(msgMeta);
            msg.setId(message.Message.MessageId);
            msg.setRawMsg(message.Message);
            msg.setEnqueueTime(message.Message.EnqueueTime);
            msg.setNextVisibleTime(message.Message.NextVisibleTime);
            callback(null, msg);
          } catch (error) {
            callback(error);
          }
        }
      }
    }, 1); // 没有消息时每秒轮询一次
  }

  /**
   * @params msg {MQMsg}
   */
  deleteMsg(msg) {
    return Promise.resolve().then(() => {
      if (!msg || !(msg instanceof MQMsg)) {
        throw new Error('msg must be a MQMsg Object!');
      }
      const rawMsg = msg.getRawMsg();
      if (!rawMsg.ReceiptHandle) {
        throw new Error('The msg object have no attribute about ReceiptHandle');
      }
      return this.getQueueHandler().deleteP(rawMsg.ReceiptHandle);
    });
  }
}
