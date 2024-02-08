const Persistence = require("../Persistence");

const toggle = function (rule) {
  if (rule.state) {
    return undeploy(rule);
  } else {
    return deploy(rule);
  }
};

const transition = async function (rule, tid) {
  if (rule.state == "falsy" && rule.atid == tid) {
    if (rule.n > rule.current + 1) {
      var deployment = {};
      deployment.id = rule.id;
      deployment.state = "falsy";
      deployment.current = rule.current + 1;
      Persistence.updateDeploymentWithCurrent(deployment);
      return null;
    } else {
      Persistence.deleteListenersByRuleId(rule.id);
      var deployment = {};
      deployment.id = rule.id;
      deployment.state = "true";
      deployment.current = null;
      Persistence.updateDeploymentWithCurrent(deployment);
      return await Persistence.getEventpatternByTemplateId(rule.stid);
    }
  }
};

const deploy = async function (rule) {
  var properties = await Persistence.getPropertiesByTemplateId(rule.atid);
  var listeners = "";
  var hasMore = false;
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
  deployment.current = 0;
  Persistence.updateDeploymentWithCurrent(deployment);
  return null;
};

const undeploy = async function (rule) {
  if (rule.state == "falsy") {
    Persistence.deleteListenersByRuleId(rule.id);
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = null;
    deployment.current = null;
    Persistence.updateDeploymentWithCurrent(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.vtid);
  } else {
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = null;
    deployment.current = null;
    Persistence.updateDeploymentWithCurrent(deployment);
    return null;
  }
};

module.exports = {
  toggle,
  transition,
};

// TODO for binary rules: check if the patterns are same -> could lead to unwanted behaviour for match/unmatch "Diese Regel macht keinen Sinn"
