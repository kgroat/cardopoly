
var stackTrace = require('stack-trace');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){

    var exporter = {

        /**
         * Creates a ResponseMessage
         * @param options
         * @returns {module.ResponseMessage}
         */
        build: function(options){
            return new ResponseMessage(options);
        },

        /**
         * Creates a MetaMessage
         * @param {String} message
         * @returns {module.MetaMessage}
         */
        buildMetaMessage: function(message, level){
            var options = { message: message, level: level || 'debug' };
            if(app.get('debug')){
                options.stackTrace = stackTrace.get();
            }
            return new MetaMessage(options);
        },

        /**
         *
         * @param level
         * @returns {*}
         */
        getMessageLevel: function(level){
            return MessageLevel.get(level);
        }
    };

    /**
     * The level name and priority of a MetaMessage
     * @param name
     * @param priority
     * @constructor
     */
    function MessageLevel(name, priority){
        this.name = name;
        this.priority = priority;
    }

    MessageLevel.error = new MessageLevel('error', 3);
    MessageLevel.warning = new MessageLevel('warning', 2);
    MessageLevel.debug = new MessageLevel('debug', 1);
    MessageLevel.message = new MessageLevel('message', 0);

    MessageLevel.get = function(name){
        if(name instanceof MessageLevel){
            return name;
        }

        return MessageLevel[name] || MessageLevel.debug;
    };

    /**
     * Represents a single message, either an Error, Warning
     * @param options
     * @constructor
     */
    function MetaMessage (options){

        /**
         * The actual message associated with this MetaMessage
         * @type {String}
         */
        this.message = options.message;

        /**
         * The stack trace from where this MetaMessage was generated, if running in debug mode
         * @type {String}
         */
        this.stackTrace = options.stackTrace;

        /**
         * The MessageLevel associated with this MetaMessage
         * @type {MessageLevel}
         */
        this.level = MessageLevel.get(options.level);
    }

    MetaMessage.prototype.toString = function(){
        return this.message;
    }

    /**
     * Represents a message to be sent as a response back from the server
     * @param [options]
     * @constructor
     */
    function ResponseMessage (options){
        options = options || {};

        var initializeMetaList = function(){
            var list;
            var i=0;
            while(i<arguments.length && !list){
                list = arguments[i];
                i++;
            }
            list = list || [];
            if(!list instanceof Array) { list = [list]; }
            for(var i in list){
                var each = list[i];
                if(!each instanceof MetaMessage){
                    list.splice(i, 1, exporter.buildMetaMessage(each.toString()));
                }
            }
            return list;
        }

        /**
         * The object to send back to the client.
         */
        this.entity = options.entity;

        /**
         * A list of errors to send back to the client.
         * @type {module.MetaMessage[]}
         */
        this.errors = initializeMetaList(options.errors, options.error);

        /**
         * A list of warnings to send back to the client.
         * @type {module.MetaMessage[]}
         */
        this.warnings = initializeMetaList(options.warnings, options.warning);

        /**
         * A list of debug messages to send back to the client.
         * @type {module.MetaMessage[]}
         */
        this.debug = initializeMetaList(options.debug);

        /**
         * A list of other messages to send back to the client.
         * @type {module.MetaMessage[]}
         */
        this.messages = initializeMetaList(options.messages, options.message);
    }

    /**
     * Adds an error or errors to the error list of this ResponseMessage.
     * @param {...String|...module.MetaMessage} error
     */
    ResponseMessage.prototype.addError = function(error){
        for(var error in arguments){
            if(error instanceof MetaMessage){
                this.errors.push(error);
            } else {
                this.errors.push(exporter.buildMetaMessage(error, 'error'));
            }
        }
    };

    /**
     * Adds a list of errors to the error list of this ResponseMessage.
     * @param {String[]|module.MetaMessage[]} errors
     */
    ResponseMessage.prototype.addErrors = function(errors){
        this.addError.apply(this, errors);
    };

    /**
     * Adds a warning or warnings to the warning list of this ResponseMessage.
     * @param {...String|...module.MetaMessage} warning
     */
    ResponseMessage.prototype.addWarning = function(warning){
        for(var warning in arguments){
            if(error instanceof MetaMessage){
                this.errors.push(warning);
            } else {
                this.errors.push(exporter.buildMetaMessage(warning, 'warning'));
            }
        }
    };

    /**
     * Adds a list of warnings to the warning list of this ResponseMessage.
     * @param {String[]|module.MetaMessage[]} warnings
     */
    ResponseMessage.prototype.addWarnings = function(warnings){
        this.addWarning.apply(this, warnings);
    };

    /**
     * Adds a message or messages to the message list of this ResponseMessage.
     * @param {...String|...module.MetaMessage} message
     */
    ResponseMessage.prototype.addMessage = function(message){
        for(var message in arguments){
            if(error instanceof MetaMessage){
                this.errors.push(message);
            } else {
                this.errors.push(exporter.buildMetaMessage(message, 'message'));
            }
        }
    };

    /**
     * Adds a list of messages to the message list of this ResponseMessage.
     * @param {String[]|module.MetaMessage[]} messages
     */
    ResponseMessage.prototype.addMessages = function(messages){
        this.addMessage.apply(this, messages);
    };

    /**
     * Checks whether or not this ResponseMessage has an entity assigned to it.
     * @returns {boolean}
     */
    ResponseMessage.prototype.hasEntity = function(){
        return !!this.entity;
    };

    /**
     * Checks whether or not the entity assigned to this ResponseMessage is a mongoose Schema.
     * @returns {boolean}
     */
    ResponseMessage.prototype.hasModelEntity = function(){
        return this.hasEntity() && this.entity instanceof Schema;
    };

    /**
     * Checks whether or not this ResponseMessage has any errors associated with it.
     * @returns {boolean}
     */
    ResponseMessage.prototype.hasErrors = function(){
        return !!this.errors.length;
    };

    /**
     * Checks whether or not this ResponseMessage has any warnings associated with it.
     * @returns {boolean}
     */
    ResponseMessage.prototype.hasWarnings = function(){
        return !!this.warnings.length;
    };

    /**
     * Checks whether or not this ResponseMessage has any messages associated with it.
     * @returns {boolean}
     */
    ResponseMessage.prototype.hasMessages = function(){
        return !!this.messages.length;
    };

    ResponseMessage.prototype.toResponseJSON = function(){
        return {
            entity: this.entity,
            errors: this.errors,
            warnings: this.warnings,
            debug: this.debug,
            messages: this.messages
        }
    }

    return exporter;
}