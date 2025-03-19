module.exports = function(RED) {
    function JsonFullSchemaValidatorNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.name = config.name;
        node.property = config.property;
        node.propertyType = config.propertyType;
        node.func = config.func;
        node.precision = config.precision || 1; // Default precision value

        node.on('input', function(msg) {
            var property = RED.util.evaluateNodeProperty(node.property, node.propertyType, node, msg);
            var precision = node.precision;

            // Use the precision value in your logic
            // For example, if you are calling ajv, include the precision option
            var ajv = new Ajv({ multipleOfPrecision: precision, strict: false });
            var validate = ajv.compile(schema);
            var valid = validate(property);

            if (!valid) {
                msg.error = validate.errors;
                node.send([null, msg]);
            } else {
                node.send([msg, null]);
            }
        });
    }
    RED.nodes.registerType("json-full-schema-validator", JsonFullSchemaValidatorNode);
}