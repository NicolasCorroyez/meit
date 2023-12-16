// Imports
const crews = require("../../data/crews.json");
const users = require("../../data/users.json");
const events = require("../../data/events.json");
const r_users_crews = require("../../data/r_users_crews.json");
const r_users_events = require("../../data/r_users_events.json");

const client = require("../../app/service/dbPool.js");

//! users IMPORT
async function importUsers() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the userss
  for (const element of users) {
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

  // I insert my userss
  const sqlQuery = `
    INSERT INTO main.users
    (nickname, firstname, lastname, device, picture, role)
    VALUES
    ${parameters.join()}
    RETURNING *;`;
  await client.query(sqlQuery, values);

  console.log("users importés avec succès !");
}
//! END users IMPORT

//! crews IMPORT
async function importCrews() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the userss
  for (const element of crews) {
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
    values.push(element.users_id);
  }

  // I insert my crewss
  const sqlQuery = `
    INSERT INTO web.crews
    (name, picture, users_id)
    VALUES
    ${parameters.join()}
    RETURNING *;`;

  await client.query(sqlQuery, values);
  console.log("crews importés avec succès !");
}
//! END crews IMPORT

//! events IMPORT
async function importEvents() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the userss
  for (const element of events) {
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

  // I insert my eventss
  const sqlQuery = `
    INSERT INTO web.events
    (theme, date, time, place, nb_people, owner)
    VALUES
    ${parameters.join()}
    RETURNING id, theme;`;

  await client.query(sqlQuery, values);

  console.log("events importés avec succès !");
}
//! END events IMPORT

//! events R_users_crews
async function importRUsersCrews() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the R_users_crews
  for (const element of r_users_crews) {
    parameters.push(
      `(
      $${counter},
      $${counter + 1})
      `
    );
    counter += 2;

    values.push(element.users_id);
    values.push(element.crews_id);
  }

  // I insert my R_users_crews
  const sqlQuery = `
    INSERT INTO web.r_users_crews
    (users_id, crews_id)
    VALUES
    ${parameters.join()}
    RETURNING id, crews_id;`;

  await client.query(sqlQuery, values);

  console.log("R_users_crews importés avec succès !");
}
//! END events R_users_crews

//! R_users_events IMPORT
async function importRUsersevents() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the R_users_events
  for (const element of r_users_events) {
    parameters.push(
      `(
      $${counter},
      $${counter + 1},
      $${counter + 2},
      $${counter + 3})
      `
    );
    counter += 4;

    values.push(element.users_id);
    values.push(element.crews_id);
    values.push(element.events_id);
    values.push(element.userstate);
  }

  // I insert my R_users_events
  const sqlQuery = `
    INSERT INTO web.r_users_events
    (users_id, crews_id, events_id, userstate)
    VALUES
    ${parameters.join()}
    RETURNING id, events_id;`;

  await client.query(sqlQuery, values);

  console.log("R_users_events importés avec succès !");
}
//! END R_users_events IMPORT

//! "IMPORT IT ALL" FUNCTION
async function importData() {
  // I delete existing data
  console.log("START TRUNCATE");
  await client.query("TRUNCATE main.users CASCADE");
  await client.query("TRUNCATE web.crews CASCADE");
  await client.query("TRUNCATE web.events CASCADE");
  await client.query("TRUNCATE web.r_users_events CASCADE");
  await client.query("TRUNCATE web.r_users_crews CASCADE");
  console.log("FINISH TRUNCATE");
  console.time("Import");

  // I launch all import functions
  await importUsers();
  await importCrews();
  await importEvents();
  await importRUsersCrews();
  await importRUsersevents();

  console.timeEnd("Import");
}

// LAUNCH THE MAIN FUNCTION
importData();
