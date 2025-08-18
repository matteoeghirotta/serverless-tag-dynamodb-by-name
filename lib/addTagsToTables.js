const util = require("util");

const mapObject = (o, fn) =>
  Object.fromEntries(Object.entries(o).map(([key, value]) => fn(key, value)));

const filterObject = (o, predicate) =>
  Object.fromEntries(
    Object.entries(o).filter(([key, value]) => predicate(key, value)),
  );

const addTags = (tagName) => (tableName, tableData) => {
  const tags = tableData["Properties"]["Tags"] ?? [];
  const tag = {
    Key: tagName,
    Value: tableData.Properties.TableName,
  };
  const index = tags.findIndex((a) => a.Key === tagName);

  if (index !== -1) tags[index] = tag;
  else tags.push(tag);

  tableData["Properties"]["Tags"] = tags;
  return [tableName, tableData];
};

function addTagsToTables() {
  let r;
  try {
    const tagName = getPluginConfig(this.serverless);
    const resources =
      this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
    const tables = filterTables(resources);

    r = mapObject(tables, addTags(tagName));
  } catch (e) {
    console.error(e);
    log(r);
  }
}

const log = (a) => console.log(show(a));

const show = (a) =>
  util.inspect(a, {
    maxArrayLength: null,
    showHidden: false,
    depth: null,
    colors: process.stdout.isTTY ? true : false,
  });

const getPluginConfig = (serverless) => {
  const tagName = serverless.service.custom.dynamodbTableTagName ?? "";
  return tagName;
};

const filterTables = (resources) =>
  filterObject(resources, (_, value) => value?.Type === "AWS::DynamoDB::Table");

module.exports = { addTagsToTables };
