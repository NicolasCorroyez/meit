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

const adminDatamapper = {
  /**
   * ! ADMIN :: GET ALL USERS
   * Method to get all users
   * @returns {[User]} Array of Users objects
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getAll() {
    const sqlQuery = `SELECT * FROM web.get_all_users();`;
    /* const sqlQuery = `SELECT * FROM main.user;`; */
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery);
      if (response.rows.length == 0) {
        error = new APIError("No user found", 404);
      } else {
        result = response.rows;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },
};

module.exports = adminDatamapper;
