const Persistence = require("../Persistence");

const toggle = function (rule) {
  if (rule.state) {
    return undeploy(rule);
  } else {
    return deploy(rule);
  }
};

const transition = async function (rule, tid) {
  if (rule.state == "truthy" && rule.atid == tid) {
    if (rule.current > 0) {
      var deployment = {};
      deployment.id = rule.id;
      deployment.state = "truthy";
      deployment.current = rule.current - 1;
      Persistence.updateDeploymentWithCurrent(deployment);
      return null;
    } else {
      if (rule.current == 0) {
        var deployment = {};
        deployment.id = rule.id;
        deployment.state = "false";
        deployment.current = null;
        Persistence.deleteListenersByRuleId(rule.id);
        Persistence.updateDeploymentWithCurrent(deployment);
        return await Persistence.getEventpatternByTemplateId(rule.vtid);
      }
      return null;
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
  deployment.state = "truthy";
  deployment.current = rule.n;
  Persistence.updateDeploymentWithCurrent(deployment);
  return null;
};

const undeploy = async function (rule) {
  if (rule.state == "truthy") {
    Persistence.deleteListenersByRuleId(rule.id);
    var deployment = {};
    deployment.id = rule.id;
    deployment.current = null;
    deployment.state = null;
    Persistence.updateDeploymentWithCurrent(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.stid);
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
