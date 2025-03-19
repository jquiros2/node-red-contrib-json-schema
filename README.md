# node-red-contrib-json-full-schema-validator-precision
I needed to be able to control the multipleofprecision option when calling ajv.

Spent a couple of days trying to figure out floating point math, used decimal.js, etc... but still had problems validating schemas.  Then realized it was the validation function itself.

In the end, it was the way ajv does its calculations (no worries with integers), and saw it has a multipleOfPrecision option (https://ajv.js.org/options.html#multipleofprecision) for setting this nicely.

This node simply builds on existing json-schema validate nodes others have worked on, adding the option as a dropdown, and updated packages.

Default is set to 6.

Based on https://www.github.com/oarroyog/node-red-contrib-json-schema
which was based on https://www.github.com/alessh/node-red-contrib-json-schema
which was based on https://www.github.com/chameleonbr/node-red-contrib-json-schema


# node-red-contrib-json-full-schema-validator
JSON Full Schema validator for Node Red is pretty easy to use.
Just open node properties and choose which property object wants to validate and paste JSON Schema
- OK will returned in first response
- KO will returned in second response. Error object with explanation will added in msg

**JSON Schema:**

{
  "title": "Person",
  "type": "object",
  "required":["lastName"],
  "properties": {
    "firstName": {
      "type": "string",
      "description": "The person's first name."
    },
    "lastName": {
      "type": "string",
      "description": "The person's last name."
    },
    "age": {
      "description": "Age in years which must be equal to or greater than zero.",
      "type": "integer",
      "minimum": 0
    }
  }
}

Examples:
- OK 
msg.payload= 
{
  "firstName": "John",
  "lastName": "Doe",
  "age": 1
};

- KO
msg.payload= 
{
  "firstName": "John",
  "age": 1
};
