module.exports = {
  ...require('./dist/credentials/SupergreenApi.credentials'),
  ...require('./dist/nodes/Supergreen/Supergreen.node'),
  ...require('./dist/nodes/Supergreen/SupergreenTrigger.node'),
};
