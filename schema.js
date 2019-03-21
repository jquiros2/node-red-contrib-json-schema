module.exports = function(RED) {
    "use strict";
    function JsonSchemaValidator(n) {
        RED.nodes.createNode(this, n);
        this.func = n.func;
        this.name = n.name;
		this.property = n.property;
		this.propertyType = n.propertyType;
		
        var node = this;

        var Ajv = require('ajv');
        var ajv = Ajv({
            allErrors: true,
            messages: true
        });
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
        
        node.on('input', function(msg) {
			var prop = RED.util.evaluateNodeProperty(node.property,node.propertyType,node,msg);
			
            if (prop !== undefined) {
                var schema = typeof node.func === 'string' && node.func.trim().length ? JSON.parse(node.func) : typeof msg.schema === 'string' ? JSON.parse(msg.schema) : msg.schema;
                var validate = ajv.compile(schema);
                var valid = validate(prop);
                if (!valid) {
                    msg['error'] = validate.errors;
                    //node.error('Invalid JSON', msg);
                    node.send([null,msg]);
                }
                else {
                    node.send([msg,null]);
                }
            } else {
                node.send([null,msg]);
				//node.error('property of type \'' + node.propertyType + '\' and name \'' + node.property + '\' is undefined', msg);
			}
        });

    }
    RED.nodes.registerType("json-full-schema-validator", JsonSchemaValidator);
};