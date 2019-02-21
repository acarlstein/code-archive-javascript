const swagger = require('restify-swagger-jsdoc');

module.export.setup = function(server){
    let options = {
        server: server
        , title: server.name
        , routePrefix: server.name
        , version: server.version
        , validatorUrl: null // Disabling
        , path: '/'.concat(server.name).concat("/")
        , apis: ['./swagger-definitions.yaml', './src/**/*.js', './src/**/*.yaml']
    };
    swagger.createSwaggerPage(options);
}