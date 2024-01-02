// REQUIRE MODULES
const client = require("../service/dbPool");
const debug = require("debug")("model");

// CLASS FOR ERROR
const APIError = require("../service/APIError");

//DEFINE TYPE FOR JSDOC
/**
 * @typedef {object} User
 * @property {number} id - id of user
 * @property {string} nickname - nickname of user
 * @property {string} firstname - firstname of user
 * @property {string} lastname - lastname of user
 * @property {string} device - device of the user
 * @property {string} picture - picture of the user
 * @property {string} role - role of the user
 */

/**
 * @typedef {object} Friend
 * @property {number} id - id of user
 * @property {string} nickname - nickname of user
 * @property {string} firstname - firstname of user
 * @property {string} lastname - lastname of user
 * @property {string} device - device of the user
 * @property {string} picture - picture of the user
 * @property {string} role - role of the user
 */

/**
 * @typedef {object} Crew
 * @property {number} id - id of user
 * @property {string} nickname - nickname of user
 * @property {string} firstname - firstname of user
 * @property {string} lastname - lastname of user
 * @property {string} device - device of the user
 * @property {string} picture - picture of the user
 * @property {string} role - role of the user
 */

/**
 * @typedef {object} InputRegisterUser
 * @property {string} nickname - nickname of user
 * @property {string} firstname - firstname of user
 * @property {string} lastname - lastname of user
 * @property {string} device - device of the user
 * @property {string} picture - picture of the user
 */

/**
 * @typedef {object} InputPatchUser
 * @property {string} nickname - nickname of user
 * @property {string} firstname - firstname of user
 * @property {string} lastname - lastname of user
 * @property {string} device - device of the user
 * @property {string} picture - picture of the user
 */

const eventDatamapper = {
  /**
   * ! USER :: GET ALL USER'S EVENTS
   * Method to get all user's events
   * @returns {[User]} Array of Users objects
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getAllEvents(userId) {
    const sqlQuery = `SELECT * FROM web.get_user_all_events($1);`;
    const values = [userId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows.length == 0) {
        error = new APIError("No events found", 404);
      } else {
        result = response.rows;
      }
    } catch (err) {
      console.log(err);
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * ! USER :: GET ONE USER'S EVENTS
   * Method to get all user's events
   * @returns {Event} Event object
   * @param {User} userId -  Id of a user
   * @param {Event} eventId - Id of an event
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getOneEvent(userId, eventId) {
    const sqlQuery = `SELECT * FROM web.get_user_one_event($1,$2);`;
    const values = [userId, eventId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows.length == 0) {
        error = new APIError("No event found", 404);
      } else {
        result = response.rows;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * ! USER :: ADD ONE EVENT
   * Method to create a user
   * @param {number} userId - ID of the user creating the event
   * @param {string} theme - Theme of the event
   * @param {string} date - Date of the event
   * @param {string} time - Time of the event
   * @param {string} place - Place of the event
   * @param {number} nb_people - Number of people for the event
   * @param {number[]} invited_users_ids - Array of invited user IDs
   * @param {number[]} invited_crews_ids - Array of invited crew IDs
   * @returns {object} - Result of the operation
   * @async
   */
  async addOneEvent(
    userId,
    theme,
    date,
    time,
    place,
    nb_people,
    invited_users_ids,
    invited_crews_ids
  ) {
    const userIDs = [invited_users_ids];
    const crewIDs = [invited_crews_ids];
    const userPlaceholders = Array.from(
      { length: userIDs.length },
      (_, i) => `$${i + 7}`
    ).join(", ");

    const crewPlaceholders = Array.from(
      { length: crewIDs.length },
      (_, i) => `$${userIDs.length + i + 7}`
    ).join(", ");

    const sqlQuery = `
  SELECT * 
  FROM web.insert_user_event($1, $2, $3, $4, $5, $6, ${userPlaceholders}, ${crewPlaceholders});
`;
    const values = [
      userId,
      theme,
      date,
      time,
      place,
      nb_people,
      ...userIDs,
      ...crewIDs,
    ];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows[0];
    } catch (err) {
      console.log(err);
      error = new APIError("Internal server error", 500);
    }
    return { error, result };
  },

  /**
   * ! USER :: MODIFY ONE EVENT
   * Method to modify a event
   * @param {InputPatchUser} eventInfo - informations of a event
   * @returns {Event} - Event object with updated informations
   * @returns {500} - if an error occured
   * @async
   */
  async modifyOneEvent(eventInfo) {
    const sqlQuery = `SELECT * FROM web.update_user_event($1);`;
    const values = [eventInfo];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows[0];
    } catch (err) {
      debug(err);
      console.log(err);
      error = new APIError("Internal error server", 500);
    }
    return { error, result };
  },

  /**
   * ! USER :: DELETE ONE EVENT
   * Method to create a user's event
   * @param {User} userId -  Id of a user
   * @param {User} eventId - Id of another user
   * @returns {500} - if an error occured
   * @async
   */
  async deleteOneEvent(eventId) {
    const sqlQuery = `SELECT * FROM web.delete_user_event($1)`;
    const values = [eventId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows[0];
    } catch (err) {
      console.log(err);
      error = new APIError("Internal server error", 500);
    }
    return { error, result };
  },
};

module.exports = eventDatamapper;
