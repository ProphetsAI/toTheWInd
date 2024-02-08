const Persistence = require('./Persistence');
const Machine = require('./Machine');

var getTemplates = function () {
  return async function (request, response, next) {
    try {
      response.send(await Persistence.getTemplates());
    } catch (err) {
      console.log(err);
      response.send(err);
    } finally {
      next();
    }
  };
};

var getRules = function () {
  return async function (request, response, next) {
    try {
      response.send(await Persistence.getRules());
    } catch (err) {
      console.log(err);
      response.send(err);
    } finally {
      next();
    }
  };
};

var getDeployed = function () {
  return async function (request, response, next) {
    try {
      var rules = await Persistence.getDeployedRules();
      response.send(rules.rows);
    } catch (err) {
      console.log(err);
      response.send(err);
    } finally {
      next();
    }
  };
};

var getEvents = function () {
  return async function (request, response, next) {
    try {
      var results = await Persistence.getEvents();
      response.send(results.rows);
    } catch (err) {
      console.log(err);
      response.send(err);
    } finally {
      next();
    }
  };
};

var insertTemplate = function () {
  return async function (request, response, next) {
    try {
      await Persistence.insertTemplate(request.body);
      response.send(await Persistence.getTemplates());
    } catch (err) {
      // TODO return available templates
      if (err.code == 23505) {
        response.status(409).send(err.detail);
      } else {
        response.send(err);
      }
    } finally {
      next();
    }
  };
};

var insertRule = function () {
  return async function (request, response, next) {
    try {
      var id = await Persistence.insertRule(request.body);
      if (id && id != 0) {
        response.send(await Persistence.getRules());
      } else {
        throw 'Insert rule error.';
      }
    } catch (err) {
      if (err.code == 23505) {
        response.status(409).send(err.detail);
      } else if (err.code == 23502) {
        response.status(400).send(err.detail);
      } else {
        response.status(400).send(err.detail);
      }
    } finally {
      next();
    }
  };
};

var processEvent = async function (event) {
  // TODO check concurrency and asynchronicity
  await Persistence.insertEvent(event);
  var events = [];
  if (event.toggleRuleId) {
    // TODO make toggleRule as event
    var rule = await Persistence.getRuleById(event.toggleRuleId);
    var eventsAfterToggle = await Machine.toggle(rule.rows[0]);
    events.push.apply(events, eventsAfterToggle);
  } else {
    var notlisteners = await Persistence.getNotListeners();
    var listener = await Persistence.getListenersForPropertyNames(
      eventProperties(event)
    );
    await Promise.all(
      notlisteners.rows.map((templateRule) =>
        getRulesForNot(event, templateRule)
      )
    )
      .then((rulesWithTemplatesForNot) => {
        return Promise.all(
          rulesWithTemplatesForNot.map((ruleWithTemplateForNot) => {
            if (ruleWithTemplateForNot) {
              return Machine.notTransition(ruleWithTemplateForNot);
            }
          })
        );
      })
      .then((newEvents) => {
        newEvents.forEach(function (currentValue, index) {
          events.push(currentValue);
        });
        return Promise.all(
          listener.rows.map((templateRule) =>
            getRulesForListener(event, templateRule)
          )
        );
      })
      .then((rulesWithTemplatesForTransition) => {
        return Promise.all(
          rulesWithTemplatesForTransition.map(
            (ruleWithTemplateForTransition) => {
              if (ruleWithTemplateForTransition) {
                return Machine.transition(ruleWithTemplateForTransition);
              }
            }
          )
        );
      })
      .then((newEvents) => {
        newEvents.forEach(function (currentValue, index) {
          events.push(currentValue);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return events;
};

var dispatchEvent = function () {
  return async function (request, response, next) {
    try {
      var event = JSON.parse(JSON.stringify(request.body));
      var events = [];
      events.push(event);
      while (events.length > 0) {
        var nextElement = events.shift();
        if (nextElement) {
          var newElements = await processEvent(nextElement);
          newElements.forEach(function (value) {
            events.push(value);
          });
        }
      }
      response.send(await Persistence.getRules());
    } catch (err) {
      response.status(400).send(err.detail);
    } finally {
      next();
    }
  };
};

var eventProperties = function (event) {
  var properties = '(';
  Object.keys(event).forEach((property, index, array) => {
    properties = properties.concat("'" + property + "'");
    if (index < array.length - 1) {
      properties = properties.concat(',');
    }
  });
  return properties.concat(')');
};

var getRulesForListener = async function (event, templateRule) {
  var match = true;
  var template = await Persistence.getEventpatternByTemplateId(
    templateRule.tid
  );
  Object.keys(template).forEach((key) => {
    if (event[key]) {
      if (template[key] != event[key]) {
        match = false;
      }
    } else {
      match = false;
    }
  });
  if (match) {
    var result = await Persistence.getRuleById(templateRule.rid);
    return { rule: result.rows[0], template: templateRule.tid };
  } else {
    return null;
  }
};

var getRulesForNot = async function (event, templateRule) {
  var match = true;
  if (templateRule) {
    var template = await Persistence.getEventpatternByTemplateId(
      templateRule.tid
    );
    Object.keys(template).forEach((key) => {
      if (event[key]) {
        if (template[key] != event[key]) {
          match = false;
        }
      } else {
        match = false;
      }
    });
  }
  if (match) {
    return null;
  } else {
    var result = await Persistence.getRuleById(templateRule.rid);
    return { rule: result.rows[0], template: templateRule.tid };
  }
};

module.exports = {
  getTemplates,
  getRules,
  getDeployed,
  getEvents,
  insertTemplate,
  insertRule,
  dispatchEvent,
};
