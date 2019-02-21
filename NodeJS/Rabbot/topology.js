const config = require('config');

const ONE_SECOND = 1000;
const LIMIT_FAIL_AFTER_MS = 50;
const LIMIT_REPLY_MS = 400;

var _connection = {
    user: config.rabbit.server.username
    , pass: config.rabbit.server.password
    , server: config.rabbit.server.host
    , vhost: config.rabbit.server.vhost
    , port: config.rabbit.server.port
    , timeout: ONE_SECOND
    , failAfter: LIMIT_FAIL_AFTER_MS
    , replyLimit: LIMIT_REPLY_MS
};

var _exchanges = [
    {
        name: 'exchange.extension'
        , type: 'direct'
        , persistent: true
        , autoDelete: false
        , durable: true        
    }
];

var _queues = [
    {
        name: 'queue.extension'
        , subscribe: true
        , durable: true
        , autoDelete: false
    }
];

var _bindings = [
    {
        exchange: 'exchange.extension'
        , target: 'queue.extension'
        , keys: ['rk.extension'] // Routing Keys
    }
];

module.exports = (rabbot, subscribeTo) => {
    return rabbot.configure({
        connection: _connection
        , exchanges: _exchanges
        , queues: _queues
        , bindings: _bindings
    });
};