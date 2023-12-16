// Imports
const crew = require("../../data/crew.json");
const user = require("../../data/user.json");
const request = require("../../data/request.json");
const r_user_crew = require("../../data/r_user_crew.json");
const r_user_request = require("../../data/r_user_request.json");

const client = require("../../app/service/dbPool.js");

//! USER IMPORT
async function importUser() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the Users
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

  // I insert my Users
  const sqlQuery = `
    INSERT INTO main.user
    (nickname, firstname, lastname, device, picture, role)
    VALUES
    ${parameters.join()}
    RETURNING *;`;
  await client.query(sqlQuery, values);

  console.log("USER importés avec succès !");
}
//! END USER IMPORT

//! CREW IMPORT
async function importCrew() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the Users
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

  // I insert my Crews
  const sqlQuery = `
    INSERT INTO web.crew
    (name, picture, user_id)
    VALUES
    ${parameters.join()}
    RETURNING *;`;

  await client.query(sqlQuery, values);
  console.log("CREW importés avec succès !");
}
//! END CREW IMPORT

//! REQUEST IMPORT
async function importRequest() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the Users
  for (const element of request) {
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

  // I insert my Requests
  const sqlQuery = `
    INSERT INTO web.request
    (theme, date, time, place, nb_people, owner)
    VALUES
    ${parameters.join()}
    RETURNING id, theme;`;

  await client.query(sqlQuery, values);

  console.log("REQUEST importés avec succès !");
}
//! END REQUEST IMPORT

//! REQUEST R_USER_CREW
async function importRUserCrew() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the R_USER_CREW
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

  // I insert my R_USER_CREW
  const sqlQuery = `
    INSERT INTO web.r_user_crew
    (user_id, crew_id)
    VALUES
    ${parameters.join()}
    RETURNING id, crew_id;`;

  await client.query(sqlQuery, values);

  console.log("R_USER_CREW importés avec succès !");
}
//! END REQUEST R_USER_CREW

//! R_USER_REQUEST IMPORT
async function importRUserRequest() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the R_USER_REQUEST
  for (const element of r_user_request) {
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
    values.push(element.request_id);
    values.push(element.userstate);
  }

  // I insert my R_USER_REQUEST
  const sqlQuery = `
    INSERT INTO web.r_user_request
    (user_id, crew_id, request_id, userstate)
    VALUES
    ${parameters.join()}
    RETURNING id, request_id;`;

  await client.query(sqlQuery, values);

  console.log("R_USER_REQUEST importés avec succès !");
}
//! END R_USER_REQUEST IMPORT

//! "IMPORT IT ALL" FUNCTION
async function importData() {
  // I delete existing data
  console.log("START TRUNCATE");
  await client.query("TRUNCATE main.user CASCADE");
  await client.query("TRUNCATE web.crew CASCADE");
  await client.query("TRUNCATE web.request CASCADE");
  await client.query("TRUNCATE web.r_user_request CASCADE");
  await client.query("TRUNCATE web.r_user_crew CASCADE");
  console.log("FINISH TRUNCATE");
  console.time("Import");

  // I launch all import functions
  await importUser();
  await importCrew();
  await importRequest();
  await importRUserCrew();
  await importRUserRequest();

  console.timeEnd("Import");
}

// LAUNCH THE MAIN FUNCTION
importData();
