const rabbot = require('rabbot');

module.export.setup = function(){
    var options = { routingKey: 'rk.extension' };
    const handle = rabbot.handle(options, handleResponse).catch(onHandleError);
}

function handleResponse(req){
    req.reply(processRequest(req));
}

function processRequest(req){
    // Keep track of the whole communication process using the optional correlationId
    var correlationId = req.properties.correlationId;
    var body = req.body;
    var response = "HELLO WORLD!";
    /*
     * DO YOUR WORK
     */
    return response;
}

function onHandleError(err, msg){
    // Log error, etc.
    msg.reject();
}