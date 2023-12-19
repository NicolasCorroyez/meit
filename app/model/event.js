// REQUIRE MODULES
const client = require("../service/dbPool");
const debug = require("debug")("model");

// CLASS FOR ERROR
const APIError = require("../service/APIError");

//DEFINE TYPE FOR JSDOC
/**
 * @typedef {object} event
 * @property {number} id - id of event
 * @property {string} theme - theme of the event
 * @property {date} date - date of the event
 * @property {time} time - time of the event
 * @property {string} place - place of the event
 * @property {string} picture - picture of the event
 */

/**
 * @typedef {object} InputRegisterevent
 * @property {string} theme - theme of the event
 * @property {date} date - date of the event
 * @property {time} time - time of the event
 * @property {string} place - place of the event
 * @property {string} picture - picture of the event
 */

/**
 * @typedef {object} InputPatchevent
 * @property {string} theme - theme of the event
 * @property {date} date - date of the event
 * @property {time} time - time of the event
 * @property {string} place - place of the event
 * @property {string} picture - picture of the event
 */

const eventDatamapper = {
  /**
   * ! GET ALL EVENTS
   * Method to get all events of a user
   * @param {int} userId - id of a user
   * @returns {[event]} Array of events objects
   * @returns {404} if no events found
   * @returns {500} if an error occured
   * @async
   */
  async getAll(userId) {
    const sqlQuery = `SELECT * FROM web.get_all_events($1);`;
    const values = [userId];
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
   * ! GET ONE event
   * Method to get a event by his id
   * @param {int} eventId - id of a event
   * @returns {event} - event object
   * @returns {404} - if a event do not exist
   * @returns {500} - if an error occured
   * @async
   */
  async getOne(eventId) {
    const sqlQuery = `SELECT * FROM web.get_one_event($1)`;
    const values = [eventId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows[0];
    } catch (err) {
      error = new APIError("Internal error server", 500);
    }
    if (result.length === 0 || result.id === null) {
      error = new APIError("event not found", 404);
    }
    return { error, result };
  },

  /**
   * ! CREATE ONE event
   * Method to create a event
   * @param {InputRegisterevent} event - informations of a event
   * @returns {500} - if an error occured
   * @async
   */
  async createOne(event) {
    const sqlQuery = `SELECT * FROM web.insert_event($1)`;
    const values = [event];
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
   * ! MODIFY ONE event
   * Method to modify a event
   * @param {InputPatchevent} eventInfo - informations of a event
   * @returns {event} - event object with updated informations
   * @returns {500} - if an error occured
   * @async
   */
  async modifyOne(eventInfo) {
    const sqlQuery = `SELECT * FROM web.update_event($1)`;
    const values = [eventInfo];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows[0];
    } catch (err) {
      debug(err);
      error = new APIError("Internal error server", 500);
    }
    return { error, result };
  },

  /**
   * ! DELETE ONE event
   * Method to delete a event
   * @param {int} eventId - id of a event
   * @returns {boolean} - true if a event has been deleted
   * @returns {404} - if a event do not exist
   * @returns {500} - if an error occured
   * @async
   */
  async deleteOne(eventId) {
    const sqlQuery = `SELECT * FROM web.delete_event($1);`;
    const values = [eventId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows == false) {
        error = new APIError("event not found", 404);
      } else {
        result = true;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },
};

module.exports = eventDatamapper;
