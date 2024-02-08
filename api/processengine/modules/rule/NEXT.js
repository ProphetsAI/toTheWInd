const Persistence = require('../Persistence');

const toggle = function (rule) {
  if (rule.state) {
    return undeploy(rule);
  } else {
    return deploy(rule);
  }
};

const notTransition = async function (rule, tid) {
  if ((rule.state = 'truthy' && rule.atid == tid)) {
    Persistence.deleteNotListenersByRuleId(rule.id);
    Persistence.deleteListenersByRuleId(rule.id);
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = 'false';
    await Persistence.updateDeployment(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.vtid);
  }
};

const transition = async function (rule, tid) {
  if (rule.state == 'truthy' && rule.atid == tid) {
    Persistence.deleteNotListenersByRuleId(rule.id);
    Persistence.deleteListenersByRuleId(rule.id);
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = 'true';
    await Persistence.updateDeployment(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.stid);
  }
};

const deploy = async function (rule) {
  var properties = await Persistence.getPropertiesByTemplateId(rule.atid);
  // create matching listeners for first state
  // create unmatching listeners for first state
  var hasMore = false;
  var listeners = '';
  properties.rows.forEach((property) => {
    if (hasMore) {
      listeners = listeners.concat(',');
    }
    listeners = listeners.concat(
      "('" + property.name + "'," + rule.atid + ',' + rule.id + ')'
    );
    hasMore = true;
  });
  await Persistence.insertNotListeners(listeners);
  await Persistence.insertListeners(listeners);

  var deployment = {};
  deployment.id = rule.id;
  deployment.state = 'truthy';
  await Persistence.updateDeployment(deployment);
  return null;
};

const undeploy = async function (rule) {
  if (rule.state == 'truthy') {
    Persistence.deleteListenersByRuleId(rule.id);
    Persistence.deleteNotListenersByRuleId(rule.id);
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = null;
    await Persistence.updateDeployment(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.stid);
  } else {
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = null;
    await Persistence.updateDeployment(deployment);
    return null;
  }
};

module.exports = {
  toggle,
  transition,
  notTransition,
};

// TODO for binary rules: check if the patterns are same -> could lead to unwanted behaviour for match/unmatch "Diese Regel macht keinen Sinn"
