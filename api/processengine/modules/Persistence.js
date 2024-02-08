const Database = require("./Database.js");

// templates: {
//   id: PK
//   name: String,
// }
// properties: {
//   tid: FK
//   name: String,
//   value: String
// }
// rules: {
//   id: PK,
//   name: String,
//   type: String,
//   atid: FK,
//   btid: FK,
//   stid: FK,
//   vtid: FK,
//   n: integer,
//   state: String.
//   mtrans: String,
//   utrans: String
// }
// listeners: {
//   property: String,
//   rid: FK
// }
// events: {
//   timestamp: PK,
//   json: String
// }

async function getTemplates() {
  try {
    var templates = await Database.executeQuery({
      text: "SELECT * FROM templates ORDER BY name ASC",
    });
    for (const template of templates.rows) {
      var eventpattern = await getEventpatternByTemplateId(template.id);
      template.eventpattern = eventpattern;
    }
    return templates.rows;
  } catch (err) {
    console.log(err);
  }
}

var getEvents = async function () {
  try {
    return Database.executeQuery({
      text: "SELECT * FROM events",
    });
  } catch (err) {
    console.log(err);
  }
};

async function getRules() {
  try {
    var results = await Database.executeQuery({
      text: "SELECT * FROM rules ORDER BY name ASC",
    });
    return results.rows;
  } catch (err) {
    console.log(err);
  }
}

function getRuleById(rid) {
  try {
    return Database.executeQuery({
      text: "SELECT * FROM rules WHERE id=" + rid,
    });
  } catch (err) {
    console.log(err);
  }
}

function getTempalteIdForListenersByRuleId(rid) {
  try {
    return Database.executeQuery({
      text: "SELECT DISTINCT tid FROM listeners WHERE rid=" + rid,
    });
  } catch (err) {
    console.log(err);
  }
}

function getPropertiesByTemplateId(templateId) {
  try {
    return Database.executeQuery({
      text: "SELECT * FROM properties WHERE tid=$1",
      values: [templateId],
    });
  } catch (err) {
    console.log(err);
  }
}

async function getEventpatternByTemplateId(templateId) {
  if (templateId) {
    var properties = await getPropertiesByTemplateId(templateId);
    var eventpattern = {};
    properties.rows.forEach((property) => {
      eventpattern[property.name] = property.value;
    });
    return eventpattern;
  } else {
    return null;
  }
}

function getDeployedRules() {
  try {
    return Database.executeQuery({
      text: "SELECT * FROM rules WHERE state IS NOT NULL ORDER BY name ASC",
    });
  } catch (err) {
    console.log(err);
  }
}

function getListenersForPropertyNames(propertyNames) {
  try {
    return Database.executeQuery({
      text:
        "SELECT DISTINCT tid, rid FROM listeners WHERE property IN " +
        propertyNames,
    });
  } catch (err) {
    console.log(err);
  }
}

function getRulesForListenersByPropertyNames(propertyNames) {
  try {
    return Database.executeQuery({
      text:
        "SELECT * FROM rules WHERE id IN (SELECT DISTINCT rid FROM listeners WHERE property IN " +
        propertyNames +
        ")",
    });
  } catch (err) {
    console.log(err);
  }
}

function getNotListeners() {
  try {
    return Database.executeQuery({
      text: "SELECT DISTINCT tid, rid FROM notlisteners",
    });
  } catch (err) {
    console.log(err);
  }
}

async function insertTemplate(template) {
  try {
    var result = await Database.executeQuery({
      text: "INSERT INTO templates(name) VALUES ($1) RETURNING id",
      values: [template.name],
    });
    var tid = result.rows[0].id;
    if (tid && tid != 0) {
      await insertPropertiesForTemplate(tid, template.eventpattern);
      // TODO rollback on error
    } else {
      throw "Insert template error.";
    }
    return tid;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// an eventpattern is formed by one or more properties all having the same templateId
async function insertPropertiesForTemplate(templateId, eventpattern) {
  var properties = "";
  Object.keys(eventpattern).forEach((property, index, array) => {
    properties = properties.concat(
      "(" + templateId + ",'" + property + "','" + eventpattern[property] + "')"
    );
    if (index < array.length - 1) {
      properties = values.concat(",");
    }
  });

  await Database.executeQuery({
    text: "INSERT INTO properties(tid, name, value) VALUES " + properties,
  });
}

async function insertEvent(event) {
  try {
    return Database.executeQuery({
      text:
        "INSERT INTO events(timestamp, json) VALUES ((SELECT extract(epoch FROM now())), $1)",
      values: [event],
    });
  } catch (err) {
    console.log(err);
  }
}

async function insertRule(rule) {
  try {
    // TODO check if TemplateA and TemplateB are equal, not only ID, but also content
    var result = await Database.executeQuery({
      text:
        "INSERT INTO rules (name, type, atid, btid, stid, vtid, n, state, mtrans, utrans) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
      values: [
        rule.name,
        rule.type.type,
        rule.atid,
        rule.btid,
        rule.stid,
        rule.vtid,
        rule.type.n,
        null,
        null,
        null,
      ],
    });
    return result.rows[0].id;
  } catch (err) {
    console.log(err);
  }
}

function insertListeners(listeners) {
  try {
    return Database.executeQuery({
      text: "INSERT INTO listeners(property, tid, rid) VALUES " + listeners,
    });
  } catch (err) {
    console.log(err);
  }
}

function insertNotListeners(listeners) {
  try {
    return Database.executeQuery({
      text: "INSERT INTO notlisteners(property, tid, rid) VALUES " + listeners,
    });
  } catch (err) {
    console.log(err);
  }
}

function updateDeployment(deployment) {
  try {
    return Database.executeQuery({
      text: "UPDATE rules SET state=($1) WHERE id=($2)",
      values: [deployment.state, deployment.id],
    });
  } catch (err) {
    console.log(err);
  }
}

function updateDeploymentWithCurrent(deployment) {
  try {
    return Database.executeQuery({
      text: "UPDATE rules SET state=($1), current=($2) WHERE id=($3)",
      values: [deployment.state, deployment.current, deployment.id],
    });
  } catch (err) {
    console.log(err);
  }
}

function deleteListenersByRuleId(ruleId) {
  try {
    return Database.executeQuery({
      text: "DELETE FROM listeners WHERE rid=" + ruleId,
    });
  } catch (err) {
    console.log(err);
  }
}

function deleteListenersByRuleIdAndTemplateId(ruleId, templateId) {
  try {
    return Database.executeQuery({
      text:
        "DELETE FROM listeners WHERE rid=" + ruleId + " AND tid=" + templateId,
    });
  } catch (err) {
    console.log(err);
  }
}

function deleteNotListenersByRuleId(ruleId) {
  try {
    return Database.executeQuery({
      text: "DELETE FROM notlisteners WHERE rid=" + ruleId,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getTemplates,
  getEvents,
  getRules,
  getRuleById,
  getTempalteIdForListenersByRuleId,
  getPropertiesByTemplateId,
  getEventpatternByTemplateId,
  getDeployedRules,
  getListenersForPropertyNames,
  getRulesForListenersByPropertyNames,
  getNotListeners,
  insertTemplate,
  insertPropertiesForTemplate,
  insertEvent,
  insertRule,
  insertListeners,
  insertNotListeners,
  updateDeployment,
  updateDeploymentWithCurrent,
  deleteListenersByRuleId,
  deleteListenersByRuleIdAndTemplateId,
  deleteNotListenersByRuleId,
};
