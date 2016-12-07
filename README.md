# bmqb-mns
[![Build Status](https://travis-ci.org/bmqb/bmqb-mns.svg?branch=master)](https://travis-ci.org/bmqb/bmqb-mns)
[![npm version](https://badge.fury.io/js/bmqb-mns.svg)](https://badge.fury.io/js/bmqb-mns)
[![codecov](https://codecov.io/gh/bmqb/bmqb-mns/branch/master/graph/badge.svg)](https://codecov.io/gh/bmqb/bmqb-mns)

基于mns的贝米钱包消息队列库

## Installation
```SHELL
npm install bmqb-mns --save
```
## Roles
* consumer: `MQConsumer(adapter, config)`
* producer: `MQProducer(adapter, config)`
* msg: `MQMSG({adapter, content, delay, priority})`

## Quick start
* 创建producer
```JS
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
```

* 创建consumer：
```JS
const adapter = 'mns';
const mnsConfig = {
    accountId: 'your-account-id',
    accessKey: 'your-access-key',
    secretKey: 'your-secret-key',
};
const consumer = new MQConsumer(adapter, mnsConfig);

// 获取一个queue consumer
const queueConsumer = consumer.getQueueConsumer('queueName');

// 接收内容, 注册一个循环任务
queueConsumer.popMsg((err, message) => {
	// message 将是一个MQMsg对象
	// ...

    // 设置消息下次可见时间
    queueConsumer.setMsgVisibility(message, 10);

	// 确认这个消息，使得消息不会再次可见
	queueConsumer.deleteMsg(message);
});
```
