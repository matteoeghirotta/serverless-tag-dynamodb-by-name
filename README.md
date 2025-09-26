# serverless-tag-dynamodb-by-name

This plugin assigns a tag with customizable `Key` property containing the table name to all DynamoDB
tables deployed in the stack. This is useful to track the AWS costs associated with each DynamoDB
table.

## plugin configuration

This plugin must be configured with a `dynamodbTableTagName` property in the `custom` section,
specifying a string argument with the name of the tag `Key` property to which the table name
will be assigned,
as in the example [serverless.yml](./examples/serverless.yml), e.g.:

```yml
custom:
  dynamodbTableTagName: ${self:service}:Name

```
