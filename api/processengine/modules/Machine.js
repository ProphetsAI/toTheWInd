const AND = require("./rule/AND.js");
const BEFORE = require("./rule/BEFORE.js");
const EXACTLY = require("./rule/EXACTLY.js");
const MAX = require("./rule/MAX.js");
const MIN = require("./rule/MIN.js");
const NAND = require("./rule/NAND.js");
const NEXT = require("./rule/NEXT.js");

var toggle = function (rule) {
  if (rule.type == "and") {
    return AND.toggle(rule);
  }
  if (rule.type == "before") {
    return BEFORE.toggle(rule);
  }
  if (rule.type == "exactly") {
    return EXACTLY.toggle(rule);
  }
  if (rule.type == "max") {
    return MAX.toggle(rule);
  }
  if (rule.type == "min") {
    return MIN.toggle(rule);
  }
  if (rule.type == "nand") {
    return NAND.toggle(rule);
  }
  if (rule.type == "next") {
    return NEXT.toggle(rule);
  }
};

var transition = async function (ruleTemplate) {
  if (ruleTemplate.rule.type == "and") {
    return await AND.transition(ruleTemplate.rule, ruleTemplate.template);
  }
  if (ruleTemplate.rule.type == "before") {
    return await BEFORE.transition(ruleTemplate.rule, ruleTemplate.template);
  }
  if (ruleTemplate.rule.type == "exactly") {
    return await EXACTLY.transition(ruleTemplate.rule, ruleTemplate.template);
  }
  if (ruleTemplate.rule.type == "max") {
    return await MAX.transition(ruleTemplate.rule, ruleTemplate.template);
  }
  if (ruleTemplate.rule.type == "min") {
    return await MIN.transition(ruleTemplate.rule, ruleTemplate.template);
  }
  if (ruleTemplate.rule.type == "nand") {
    return await NAND.transition(ruleTemplate.rule, ruleTemplate.template);
  }
  if (ruleTemplate.rule.type == "next") {
    return await NEXT.transition(ruleTemplate.rule, ruleTemplate.template);
  }
  return null;
};

var notTransition = async function (ruleTemplate) {
  if (ruleTemplate.rule.type == "next") {
    return await NEXT.notTransition(ruleTemplate.rule, ruleTemplate.template);
  }
  return null;
};

module.exports = {
  toggle,
  transition,
  notTransition,
};
