// REQUIRE MODULES
const client = require("../service/dbPool");
const debug = require("debug")("model");

// CLASS FOR ERROR
const APIError = require("../service/APIError");

//DEFINE TYPE FOR JSDOC
/**
 * @typedef {object} Crew
 * @property {number} id - id of crew
 * @property {string} name - name of the crew
 * @property {string} picture - picture of the crew
 */

/**
 * @typedef {object} InputRegistercrew
 * @property {string} nickname - nickname of crew
 * @property {string} name - name of the crew
 * @property {string} picture - picture of the crew
 */

/**
 * @typedef {object} InputPatchcrew
 * @property {string} name - name of the crew
 * @property {string} picture - picture of the crew
 */

const crewDatamapper = {
  /**
   * ! GET ALL CREWS
   * Method to get all crews
   * @returns {[Crew]} Array of crews objects
   * @returns {404} if no crews found
   * @returns {500} if an error occured
   * @async
   */
  async getAll() {
    const sqlQuery = `SELECT * FROM web.get_all_crews();`;
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery);
      if (response.rows.length == 0) {
        error = new APIError("No crew found", 404);
      } else {
        result = response.rows;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * ! GET ONE CREW
   * Method to get a crew by his id
   * @param {int} crewId - id of a crew
   * @returns {Crew} - crew object
   * @returns {404} - if a crew do not exist
   * @returns {500} - if an error occured
   * @async
   */
  async getOne(crewId) {
    const sqlQuery = `SELECT * FROM web.get_one_crew($1)`;
    const values = [crewId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows[0];
    } catch (err) {
      error = new APIError("Internal error server", 500);
    }
    if (result.length === 0 || result.id === null) {
      error = new APIError("crew not found", 404);
    }
    return { error, result };
  },

  /**
   * ! CREATE ONE crew
   * Method to create a crew
   * @param {InputRegistercrew} crew - informations of a crew
   * @returns {500} - if an error occured
   * @async
   */
  async createOne(crew) {
    const sqlQuery = `SELECT * FROM web.insert_crew($1)`;
    const values = [crew];
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
   * ! MODIFY ONE crew
   * Method to modify a crew
   * @param {InputPatchcrew} crewInfo - informations of a crew
   * @returns {crew} - crew object with updated informations
   * @returns {500} - if an error occured
   * @async
   */
  async modifyOne(crewInfo) {
    const sqlQuery = `SELECT * FROM web.update_crew($1)`;
    const values = [crewInfo];
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
   * ! DELETE ONE crew
   * Method to delete a crew
   * @param {int} crewId - id of a crew
   * @returns {boolean} - true if a crew has been deleted
   * @returns {404} - if a crew do not exist
   * @returns {500} - if an error occured
   * @async
   */
  async deleteOne(crewId) {
    const sqlQuery = `SELECT * FROM web.delete_crew($1);`;
    const values = [crewId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows == false) {
        error = new APIError("crew not found", 404);
      } else {
        result = true;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },
};

module.exports = crewDatamapper;
