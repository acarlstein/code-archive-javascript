const rabbot = require('rabbot');

const ONE_MINUTE = 60000;

function Requestor(){
}

Requestor.prototype.extension = function(req, res, next){
    var options = {
        type: 'request'
        , routingKey: 'rk.extension'
        , contentType: 'application/json'
        , body: req.body
        , timeout: ONE_MINUTE
        , retryTimeout: ONE_MINUTE
    }

    rabbot.request('exchange.extension', options)
          .progress(function(reply){
              // Deal with multiple replies; however, last reply will be sent via the process calback
          })
          .then((msg) => {
              res.send(200, msg.body);
              msg.ack();
          });
};

module.exports = Requestor;