var Ajv = require('ajv');

module.exports = function(RED) {
    function JsonFullSchemaValidatorNodePrecision(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.name = config.name;
        node.property = config.property;
        node.propertyType = config.propertyType;
        node.func = config.func;
        node.precision = parseFloat(config.precision) || 1; // Default precision value, ensure it's a number

        node.on('input', function(msg) {
            var propertyToValidate = RED.util.evaluateNodeProperty(node.property, node.propertyType, node, msg);

            // Load the schema from the node configuration or the message
            var schema;
            try {
                schema = typeof node.func === 'string' && node.func.trim().length ? JSON.parse(node.func) : typeof msg.schema === 'string' ? JSON.parse(msg.schema) : msg.schema;
            } catch (e) {
                node.error("Error parsing JSON schema: " + e.message, msg);
                node.send([null, msg]);
                return; // Stop processing if the schema is invalid
            }
            if (!schema) {
                node.warn("No schema provided.", msg);
                node.send([null, msg]);
                return;
            }

            // Create ajv instance with multipleOfPrecision
            var ajv = new Ajv({ multipleOfPrecision: node.precision, allErrors: true, strict: false });

            // Compile the schema
            let validate;
            try {
                validate = ajv.compile(schema);
            } catch (e) {
                node.error("Error compiling JSON schema: " + e.message, msg);
                node.send([null, msg]);
                return; // Stop processing if the schema compilation fails
            }

            // Validate the property
            var valid = validate(propertyToValidate);

            if (!valid) {
                msg.error = validate.errors;
                node.send([null, msg]);
            } else {
                node.send([msg, null]);
            }
        });
    }
    RED.nodes.registerType("json-full-schema-validator-precision", JsonFullSchemaValidatorNodePrecision);
};