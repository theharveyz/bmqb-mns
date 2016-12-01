import { MQProducer } from 'bmqb-mq';

const adapter = 'mns';
const mnsConfig = {
    accountId: 'your-account-id',
    accessKey: 'your-access-key',
    secretKey: 'your-secret-key',
};
const producer = new MQProducer(adapter, mnsConfig);

// 获取一个queue producer
const queueProducer = producer.getQueueProducer('queueName');

// 生成一个MQMsg对象
const msg = new MQMsg({
  adapter: 'mns', // 必填
  content: {foo: 'bar'}, // 必填
  delay: 10, // 延迟十秒
  priority: 'high', // 优先级, 默认为 'normal'
});

// 接收内容, pushMsg方法将返回一个Promise对象
queueProducer.pushMsg(msg).then(message => {
  // message 是一个MQMsg对象
}).catch(err => {
  // ...
});
