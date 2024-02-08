/// ----- TABLES START ----- ///

// client.query('DROP DATABASE IF EXISTS dshadshme;', (err, res) => {
//   if (err) {
//     console.error(err);
//   }
//   console.log('Database dshadshme dropped.')
// });
// client.query('CREATE DATABASE dshadshme;', (err, res) => {
//   if (err) {
//     console.error(err);
//   }
//   console.log("Database dshadshme created.");
// });

/// ----- TABLES END ----- ///

// async function processEvent(event) {
//   var eventpatternIds = await findPropertyListeners(event);
//   eventpatternIds.forEach(async (row) => {
//     var propertiesWithSameEventpatternId = await getProperties(
//       row.eventpatternid
//     );
//     var eventpattern = {};
//     propertiesWithSameEventpatternId.forEach((property) => {
//       eventpattern[property.name] = property.value;
//     });
//     if (isMatch(event, eventpattern)) {
//       console.log("match! " + eventpattern);
//       // TODO get rule for eventpattern
//       // combine event with rule
//     }
//   });
// }

// function getNextEventpatternId() {
//   return client
//     .query("SELECT max(eventpatternid) FROM properties")
//     .then((res) => {
//       var max = res.rows[0].max;
//       if (max === null) {
//         return 1;
//       }
//       return ++max;
//     });
// }

// function isMatch(event, eventpattern) {
//   Object.keys(eventpattern).forEach((property) => {
//     if (eventpattern[property] != event[property]) {
//       return false;
//     }
//   });
//   return true;
// }

// function findPropertyListeners(event) {
//   var properties = Object.keys(event);
//   var propertynames = "(";
//   var i;
//   for (i = 0; i < properties.length; i++) {
//     propertynames = propertynames.concat("'" + properties[i] + "'");
//     if (i < properties.length - 1) {
//       propertynames = propertynames.concat(",");
//     }
//   }
//   propertynames = propertynames.concat(")");

//   var query = "SELECT DISTINCT eventpatternid FROM propertylisteners WHERE propertyname IN ".concat(
//     propertynames
//   );
// }

// foreach property in event:
//  find property-listeners
//  foreach property-listener
//    find eventpattern listeners with this property
// SELECT distinct eventpatternId WHERE propertyname in ('abc','def') Object.keys(event)
// test for contradicting rules (in createRule compare eventpatterns)

// insertMany(events) {
//   var hasMore = false;
//   var eventString = "";
//   events.forEach((element) => {
//     if (hasMore) {
//       eventString = eventString.concat(",");
//     }
//     eventString = eventString.concat(
//       "((SELECT date_part FROM ts), '" + JSON.stringify(element) + "')"
//     );
//     hasMore = true;
//   });
//   return {
//     text:
//       "WITH ts AS (SELECT extract(epoch FROM now())) INSERT INTO events(timestamp, json) VALUES " +
//       eventString,
//   };
// },

// START Create Pattern
// var rule = request.body;

// var patternA = rule.patterna;
// var patternIdA = await createEventpattern(patternA);

// var patternB = rule.patternb;
// var patternIdB = null;
// if (patternB) {
//   patternIdB = await createEventpattern(patternB);
// }
// STOP Create Pattern

// async function createRule(rule) {
//   return executeQuery(insertRule(rule, eventpatternida, eventpatternidb)).then(
//     (res) => {
//       processRule(res.rows[0]);
//     }
//   );
// }
