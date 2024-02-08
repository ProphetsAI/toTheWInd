const Persistence = require("../Persistence");

const toggle = function (rule) {
  if (rule.state) {
    return undeploy(rule);
  } else {
    return deploy(rule);
  }
};

const deploy = async function (rule) {
  var properties = await Persistence.getPropertiesByTemplateId(rule.atid);
  // create matching listeners for first state
  // create unmatching listeners for first state
  var hasMore = false;
  var listeners = "";
  properties.rows.forEach((property) => {
    if (hasMore) {
      listeners = listeners.concat(",");
    }
    listeners = listeners.concat(
      "('" + property.name + "'," + rule.atid + "," + rule.id + ")"
    );
    hasMore = true;
  });
  await Persistence.insertListeners(listeners);

  var deployment = {};
  deployment.id = rule.id;
  deployment.state = "falsy";
  deployment.current = rule.n;
  Persistence.updateDeploymentWithCurrent(deployment);
  return null;
};

const transition = async function (rule, tid) {
  if (rule.state == "falsy" && rule.atid == tid) {
    if (rule.current > 1) {
      var deployment = {};
      deployment.id = rule.id;
      deployment.state = "falsy";
      deployment.current = rule.current - 1;
      Persistence.updateDeploymentWithCurrent(deployment);
      return null;
    } else {
      var deployment = {};
      deployment.id = rule.id;
      deployment.state = "truthy";
      deployment.current = rule.current - 1;
      Persistence.updateDeploymentWithCurrent(deployment);
      return null;
    }
  }
  if (rule.state == "truthy" && rule.atid == tid) {
    Persistence.deleteListenersByRuleId(rule.id);
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = "false";
    deployment.current = null;
    Persistence.updateDeploymentWithCurrent(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.vtid);
  }
  return null;
};

const undeploy = async function (rule) {
  if (rule.state == "falsy") {
    Persistence.deleteListenersByRuleId(rule.id);
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = null;
    Persistence.updateDeployment(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.vtid);
  }
  if (rule.state == "false") {
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = null;
    Persistence.updateDeployment(deployment);
    return null;
  }
  if (rule.state == "truthy") {
    Persistence.deleteListenersByRuleId(rule.id);
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = null;
    Persistence.updateDeployment(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.stid);
  }
};

module.exports = {
  toggle,
  transition,
};

// TODO for binary rules: check if the patterns are same -> could lead to unwanted behaviour for match/unmatch "Diese Regel macht keinen Sinn"
