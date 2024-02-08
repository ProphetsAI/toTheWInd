const Persistence = require("../Persistence");

const toggle = function (rule) {
  if (rule.state) {
    return undeploy(rule);
  } else {
    return deploy(rule);
  }
};

const deploy = async function (rule) {
  var propertiesA = await Persistence.getPropertiesByTemplateId(rule.atid);
  var propertiesB = await Persistence.getPropertiesByTemplateId(rule.btid);
  var hasMore = false;
  var listenersA = "";
  propertiesA.rows.forEach((property) => {
    if (hasMore) {
      listenersA = listenersA.concat(",");
    }
    listenersA = listenersA.concat(
      "('" + property.name + "'," + rule.atid + "," + rule.id + ")"
    );
    hasMore = true;
  });

  hasMore = false;
  var listenersB = "";
  propertiesB.rows.forEach((property) => {
    if (hasMore) {
      listenersB = listenersB.concat(",");
    }
    listenersB = listenersB.concat(
      "('" + property.name + "'," + rule.btid + "," + rule.id + ")"
    );
    hasMore = true;
  });

  await Persistence.insertListeners(listenersA);
  await Persistence.insertListeners(listenersB);

  var deployment = {};
  deployment.id = rule.id;
  deployment.state = "falsy";
  Persistence.updateDeployment(deployment);
  return null;
};

const transition = async function (rule, tid) {
  if (rule.state == "falsy" && rule.atid == tid) {
    await Persistence.deleteListenersByRuleIdAndTemplateId(rule.id, tid);
    var result = await Persistence.getTempalteIdForListenersByRuleId(rule.id);
    if (result.rowCount == 1) {
      var deployment = {};
      deployment.id = rule.id;
      deployment.state = "truthy";
      Persistence.updateDeployment(deployment);
      return null;
    }
  }
  if (rule.state == "falsy" && rule.btid == tid) {
    await Persistence.deleteListenersByRuleId(rule.id);
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = "false";
    Persistence.updateDeployment(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.vtid);
  }
  if (rule.state == "truthy" && rule.btid == tid) {
    await Persistence.deleteListenersByRuleIdAndTemplateId(rule.id, tid);
    var result = await Persistence.getTempalteIdForListenersByRuleId(rule.id);
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = "true";
    Persistence.updateDeployment(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.stid);
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
  if (rule.state == "truthy") {
    var deployment = {};
    deployment.id = rule.id;
    deployment.state = null;
    Persistence.updateDeployment(deployment);
    return await Persistence.getEventpatternByTemplateId(rule.stid);
  }
  var deployment = {};
  deployment.id = rule.id;
  deployment.state = null;
  Persistence.updateDeployment(deployment);
  return null;
};

module.exports = {
  toggle,
  transition,
};

// TODO for binary rules: check if the patterns are same -> could lead to unwanted behaviour for match/unmatch "Diese Regel macht keinen Sinn"
