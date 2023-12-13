/************************************************/
/****** Import categories and posts datas *******/
/************************************************/

const booking = require("../../data/booking.json");
const departure = require("../../data/departure.json");
const hostel = require("../../data/hostel.json");
const planet = require("../../data/planet.json");
const comeback = require("../../data/comeback.json");
const room = require("../../data/room.json");
const user = require("../../data/users.json");
const spaceship = require("../../data/spaceship.json");

const client = require("../../app/service/dbPool.js");

//initialisation of array to search foreign key
let planetDB;
let hostelDB;
let spaceshipDB;
let departureDB;
let comebackDB;
let roomDB;
let userDB;

async function importPlanet() {
  //1. I get data from the planets
  const values = [];
  const parameters = [];
  let counter = 1;
  for (const element of planet) {
    parameters.push(
      `($${counter},$${counter + 1},$${counter + 2},$${counter + 3},$${
        counter + 4
      },$${counter + 5},$${counter + 6},$${counter + 7},$${counter + 8})`
    );
    counter += 9;

    values.push(element.name);
    values.push(element.distance);
    values.push(element.distance_light_year);
    values.push(element.content);
    values.push(element.radius);
    values.push(element.temp_min);
    values.push(element.temp_max);
    values.push(element.img);
    values.push(element.price);
  }

  //1.1 Insert a planet and get all ids
  const sqlQuery = `
          INSERT INTO web.planet
          (name, distance, distance_light_year, content, radius, temp_min, temp_max, img, price)
          VALUES 
          ${parameters.join()}
          RETURNING id, name;`;

  const response = await client.query(sqlQuery, values);
  planetDB = response.rows;

  console.log("Planetes importées avec succès !");
}

async function importHostel() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I get data from the hostels
  for (const element of hostel) {
    parameters.push(
      `($${counter},$${counter + 1},$${counter + 2},$${counter + 3},$${
        counter + 4
      })`
    );
    counter += 5;

    // I get the planet_id of the hostel I want to insert
    const planetId = planetDB.find(
      (planet) => element.planet == planet.name
    ).id;

    values.push(element.name);
    values.push(element.content);
    values.push(element.adress);
    values.push(element.img);
    values.push(planetId);
  }

  // I insert my hostels and get all id associate to name in a array
  const sqlQuery = `
    INSERT INTO web.hostel
    (name, content, adress, img, planet_id)
    VALUES
    ${parameters.join()}
    RETURNING id, name;`;

  const response = await client.query(sqlQuery, values);
  hostelDB = response.rows;

  console.log("hostels importés avec succès !");
}

async function importRoom() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I get data from the rooms
  for (const element of room) {
    parameters.push(
      `($${counter},$${counter + 1},$${counter + 2},$${counter + 3},$${
        counter + 4
      })`
    );
    counter += 5;

    // I get the hostel_id of the room I want to insert
    const hostelId = hostelDB.find(
      (hostel) => element.hostel === hostel.name
    ).id;

    values.push(element.content);
    values.push(element.price);
    values.push(element.max_place);
    values.push(element.rank);
    values.push(hostelId);
  }

  // I insert my room and get all id associate to rank in a array
  const sqlQuery = `
    INSERT INTO web.room
    (content, price, max_place, rank, hostel_id)
    VALUES
    ${parameters.join()}
    RETURNING id, rank;`;

  const response = await client.query(sqlQuery, values);
  roomDB = response.rows;

  console.log("rooms importés avec succès !");
}

async function importSpaceship() {
  //1. I get data from the spaceship
  const values = [];
  const parameters = [];
  let counter = 1;
  for (const element of spaceship) {
    parameters.push(`($${counter},$${counter + 1},$${counter + 2})`);
    counter += 3;

    values.push(element.name);
    values.push(element.max_place);
    values.push(element.content);
  }

  // I insert my spaceship and get all id associate to name in a array
  const sqlQuery = `
          INSERT INTO web.spaceship
          (name, max_place, content)
          VALUES 
          ${parameters.join()}
          RETURNING id, name;`;

  const response = await client.query(sqlQuery, values);
  spaceshipDB = response.rows;

  console.log("Spaceship importées avec succès !");
}

async function importDeparture() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //1. I get data from the departure
  for (const element of departure) {
    parameters.push(
      `($${counter},$${counter + 1},$${counter + 2},$${counter + 3})`
    );
    counter += 4;

    // I get the spaceship_id of the departure I want to insert
    const spaceshipId = spaceshipDB.find(
      (spaceship) => element.spaceship == spaceship.name
    ).id;

    // I get the planet_id of the departure I want to insert
    const planetId = planetDB.find(
      (planet) => element.planet == planet.name
    ).id;

    values.push(element.departure_date);
    values.push(element.reserved_place);
    values.push(spaceshipId);
    values.push(planetId);
  }

  // I insert my departure and get all id associate to departure_date in a array
  const sqlQuery = `
      INSERT INTO web.departure
      (departure_date, reserved_place, spaceship_id, planet_id)
      VALUES
      ${parameters.join()}
      RETURNING id, departure_date;`;

  const response = await client.query(sqlQuery, values);
  departureDB = response.rows;

  // format date

  for (element of departureDB) {
    const date = new Date(element.departure_date).toLocaleDateString("fr-Fr");
    const [day, month, year] = date.split("/");
    const newDateStr = `${year}-${month}-${day}`;
    element.departure_date = newDateStr;
  }

  console.log("departures importés avec succès !");
}

async function importComeback() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //1. I get data from the comeback
  for (const element of comeback) {
    parameters.push(
      `($${counter},$${counter + 1},$${counter + 2},$${counter + 3})`
    );
    counter += 4;

    // I get the spaceship_id of the comeback I want to insert
    const spaceshipId = spaceshipDB.find(
      (spaceship) => element.spaceship == spaceship.name
    ).id;

    // I get the planet_id of the comeback flights I want to insert
    const planetId = planetDB.find(
      (planet) => element.planet == planet.name
    ).id;

    values.push(element.comeback_date);
    values.push(element.reserved_place);
    values.push(spaceshipId);
    values.push(planetId);
  }

  // I insert my comeback flights and get all id associate to comeback_date in a array
  const sqlQuery = `
      INSERT INTO web.comeback
      (comeback_date, reserved_place, spaceship_id, planet_id)
      VALUES
      ${parameters.join()}
      RETURNING id, comeback_date;`;

  const response = await client.query(sqlQuery, values);
  comebackDB = response.rows;

  for (element of comebackDB) {
    const date = new Date(element.comeback_date).toLocaleDateString("fr-Fr");
    const [day, month, year] = date.split("/");
    const newDateStr = `${year}-${month}-${day}`;
    element.comeback_date = newDateStr;
  }

  console.log("comebacks importés avec succès !");
}

async function importUser() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the Users
  for (const element of user) {
    parameters.push(
      `($${counter},$${counter + 1},$${counter + 2},$${counter + 3},$${
        counter + 4
      })`
    );
    counter += 5;

    values.push(element.firstname);
    values.push(element.lastname);
    values.push(element.mail);
    values.push(element.password);
    values.push(element.role);
  }

  // I insert my Users
  const sqlQuery = `
    INSERT INTO administration.user
    (firstname, lastname, mail, password, role)
    VALUES
    ${parameters.join()}
    RETURNING id, mail;`;

  const response = await client.query(sqlQuery, values);
  userDB = response.rows;

  console.log("users importés avec succès !");
}

async function importBooking() {
  const values = [];
  const parameters = [];
  let counter = 1;

  //2. I go through the departures
  for (const element of booking) {
    parameters.push(
      `($${counter},$${counter + 1},$${counter + 2}, $${counter + 3}, $${
        counter + 4
      }, $${counter + 5}, $${counter + 6})`
    );
    counter += 7;

    // I get the hostel of the booking I want to insert
    const hostelId = hostelDB.find(
      (hostel) => element.hostel === hostel.name
    ).id;
    // I get the room_id of the booking I want to insert
    const roomId = roomDB.find((room) => element.room == room.rank).id;
    // I get the departure_id of the booking I want to insert
    const departureId = departureDB.find(
      (departure) => element.departure === departure.departure_date
    ).id;
    // I get the comeback_id of the booking I want to insert
    const comebackeId = comebackDB.find(
      (comeback) => element.comeback === comeback.comeback_date
    ).id;
    // I get the user_id of the booking I want to insert
    const userId = userDB.find((user) => element.user === user.mail).id;

    values.push(element.nbparticipants);
    values.push(element.total_price);
    values.push(hostelId);
    values.push(roomId);
    values.push(departureId);
    values.push(comebackeId);
    values.push(userId);
  }

  // I insert my booking
  const sqlQuery = `
      INSERT INTO web.booking
      (nbparticipants,total_price, hostel_id, room_id, departure_id, comeback_id, user_id)
      VALUES
      ${parameters.join()}`;

  await client.query(sqlQuery, values);

  console.log("comebacks importés avec succès !");
}

// "IMPORT IT ALL" FUNCTION
async function importData() {
  // I delete existing data
  await client.query("TRUNCATE web.planet CASCADE");
  await client.query("TRUNCATE web.hostel CASCADE");
  await client.query("TRUNCATE web.room CASCADE");
  await client.query("TRUNCATE web.spaceship CASCADE");
  await client.query("TRUNCATE web.departure CASCADE");
  await client.query("TRUNCATE web.comeback CASCADE");
  await client.query("TRUNCATE administration.user CASCADE");
  await client.query("TRUNCATE web.booking CASCADE");

  console.time("Import");

  // I launch all import functions
  await importPlanet();
  await importHostel();
  await importRoom();
  await importSpaceship();
  await importDeparture();
  await importComeback();
  await importUser();
  await importBooking();

  console.timeEnd("Import");
}

// LAUNCH THE MAIN FUNCTION
importData();
