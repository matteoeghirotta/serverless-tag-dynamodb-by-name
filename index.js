const { addTagsToTables } = require("./lib/addTagsToTables");

class ServerlessPluginTagDynamodb {
  constructor(serverless) {
    this.serverless = serverless;

    this.hooks = {
      "after:aws:package:finalize:mergeCustomProviderResources":
        addTagsToTables.bind(this),
    };
  }
}

module.exports = ServerlessPluginTagDynamodb;
