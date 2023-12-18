// Imports
const crew = require("../../data/crew.json");
const contact = require("../../data/contact.json");
const user = require("../../data/user.json");
const event = require("../../data/event.json");
const r_user_crew = require("../../data/r_user_crew.json");
const r_user_event = require("../../data/r_user_event.json");

const client = require("../../app/service/dbPool.js");

//! user IMPORT
async function importUser() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the users
  for (const element of user) {
    parameters.push(
      `(
      $${counter},
      $${counter + 1},
      $${counter + 2},
      $${counter + 3},
      $${counter + 4},
      $${counter + 5})
      `
    );
    counter += 6;

    values.push(element.nickname);
    values.push(element.firstname);
    values.push(element.lastname);
    values.push(element.device);
    values.push(element.picture);
    values.push(element.role);
  }

  // I insert my users
  const sqlQuery = `
    INSERT INTO main.user
    (nickname, firstname, lastname, device, picture, role)
    VALUES
    ${parameters.join()}
    RETURNING *;`;
  await client.query(sqlQuery, values);

  console.log("user importés avec succès !");
}
//! END user IMPORT

//! crew IMPORT
async function importCrew() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the users
  for (const element of crew) {
    parameters.push(
      `(
      $${counter},
      $${counter + 1},
      $${counter + 2})
      `
    );
    counter += 3;
    values.push(element.name);
    values.push(element.picture);
    values.push(element.user_id);
  }

  // I insert my crews
  const sqlQuery = `
    INSERT INTO web.crew
    (name, picture, user_id)
    VALUES
    ${parameters.join()}
    RETURNING *;`;

  await client.query(sqlQuery, values);
  console.log("crew importés avec succès !");
}
//! END crew IMPORT

//! contact IMPORT
async function importContact() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the users
  for (const element of contact) {
    parameters.push(
      `(
      $${counter},
      $${counter + 1})
      `
    );
    counter += 2;
    values.push(element.user_id);
    values.push(element.friend_id);
  }

  // I insert my contact
  const sqlQuery = `
    INSERT INTO web.contact
    (user_id, friend_id)
    VALUES
    ${parameters.join()}
    RETURNING *;`;

  await client.query(sqlQuery, values);
  console.log("contact importés avec succès !");
}
//! END contact IMPORT

//! event IMPORT
async function importEvent() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the users
  for (const element of event) {
    parameters.push(
      `(
      $${counter},
      $${counter + 1},
      $${counter + 2},
      $${counter + 3},
      $${counter + 4},
      $${counter + 5})
      `
    );
    counter += 6;

    values.push(element.theme);
    values.push(element.date);
    values.push(element.time);
    values.push(element.place);
    values.push(element.nb_people);
    values.push(element.owner);
  }

  // I insert my events
  const sqlQuery = `
    INSERT INTO web.event
    (theme, date, time, place, nb_people, owner)
    VALUES
    ${parameters.join()}
    RETURNING id, theme;`;

  await client.query(sqlQuery, values);

  console.log("event importés avec succès !");
}
//! END event IMPORT

//! event R_user_crew
async function importRUserCrew() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the R_user_crew
  for (const element of r_user_crew) {
    parameters.push(
      `(
      $${counter},
      $${counter + 1})
      `
    );
    counter += 2;

    values.push(element.user_id);
    values.push(element.crew_id);
  }

  // I insert my R_user_crew
  const sqlQuery = `
    INSERT INTO web.r_user_crew
    (user_id, crew_id)
    VALUES
    ${parameters.join()}
    RETURNING id, crew_id;`;

  await client.query(sqlQuery, values);

  console.log("R_user_crew importés avec succès !");
}
//! END event R_user_crew

//! R_user_event IMPORT
async function importRUserEvent() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the R_user_event
  for (const element of r_user_event) {
    parameters.push(
      `(
      $${counter},
      $${counter + 1},
      $${counter + 2},
      $${counter + 3})
      `
    );
    counter += 4;

    values.push(element.user_id);
    values.push(element.crew_id);
    values.push(element.event_id);
    values.push(element.userstate);
  }

  // I insert my R_user_event
  const sqlQuery = `
    INSERT INTO web.r_user_event
    (user_id, crew_id, event_id, userstate)
    VALUES
    ${parameters.join()}
    RETURNING id, event_id;`;

  await client.query(sqlQuery, values);

  console.log("R_user_event importés avec succès !");
}
//! END R_user_event IMPORT

//! "IMPORT IT ALL" FUNCTION
async function importData() {
  // I delete existing data
  console.log("START TRUNCATE");
  await client.query("TRUNCATE main.user CASCADE");
  await client.query("TRUNCATE web.crew CASCADE");
  await client.query("TRUNCATE web.contact CASCADE");
  await client.query("TRUNCATE web.event CASCADE");
  await client.query("TRUNCATE web.r_user_event CASCADE");
  await client.query("TRUNCATE web.r_user_crew CASCADE");
  console.log("FINISH TRUNCATE");
  console.time("Import");

  // I launch all import functions
  await importUser();
  await importCrew();
  await importContact();
  await importEvent();
  await importRUserCrew();
  await importRUserEvent();

  console.timeEnd("Import");
}

// LAUNCH THE MAIN FUNCTION
importData();
