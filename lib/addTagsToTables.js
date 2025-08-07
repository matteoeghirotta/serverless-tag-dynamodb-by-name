const util = require("util");

const mapObject = (o, fn) =>
  Object.fromEntries(Object.entries(o).map(([key, value]) => fn(key, value)));

const filterObject = (o, predicate) =>
  Object.fromEntries(
    Object.entries(o).filter(([key, value]) => predicate(key, value)),
  );

const addTags = (prefix) => (tableName, tableData) => {
  const tags = tableData["Properties"]["Tags"] ?? [];

  tags.push({
    Key: prefix,
    Value: tableData.Properties.TableName,
  });

  tableData["Properties"]["Tags"] = tags;
  return [tableName, tableData];
};

function addTagsToTables() {
  let r;
  try {
    const prefix = getPluginConfig(this.serverless);
    const resources =
      this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
    const tables = filterTables(resources);

    r = mapObject(tables, addTags(prefix));
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
  const prefix = serverless.service.custom.resourceTagName.prefix ?? "";
  return prefix;
};

const filterTables = (resources) =>
  filterObject(resources, (_, value) => value?.Type === "AWS::DynamoDB::Table");

module.exports = { addTagsToTables };
