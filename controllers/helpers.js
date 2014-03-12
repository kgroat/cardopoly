var http = require('http');

var helpers = module.exports = {
    /**
     *
     * @param {ResponseMessage} responseMessage
     * @param {ServerResponse} httpResponse
     */
    handleResponse: function(responseMessage, httpResponse){
        if(responseMessage.hasErrors()){
            httpResponse.status(400).send(responseMessage);
        } else {
            responseMessage.send(responseMessage);
        }
    }
}

http.ServerResponse.prototype.handleResponse = function(responseMessage){
    return helpers.handleResponse(responseMessage, this);
}