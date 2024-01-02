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

const crewDatamapper = {
  /**
   * ! USER :: GET ALL USER'S CREWS
   * Method to get all user's crews
   * @returns {[User]} Array of Users objects
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getAllCrews(userId) {
    const sqlQuery = `SELECT * FROM web.get_user_all_crews($1);`;
    const values = [userId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows.length == 0) {
        error = new APIError("No crews found", 404);
      } else {
        result = response.rows;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * ! USER :: GET ONE USER'S CREW
   * Method to get all users
   * @returns {User} User object
   * @param {User} userId -  Id of a user
   * @param {User} crewId - Id of another user
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getOneCrew(userId, crewId) {
    const sqlQuery = `SELECT * FROM web.get_user_one_crew($1,$2);`;
    const values = [userId, crewId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows.length == 0) {
        error = new APIError("No user found", 404);
      } else {
        result = response.rows[0];
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * ! USER :: ADD ONE CREW
   * Method to create a user
   * @param {User} userId -  Id of a user
   * @param {Crew} crewId - Id of another user
   * @returns {500} - if an error occured
   * @async
   */
  async addOneCrew(userId, crew_name, crew_picture, added_friends) {
    const userIDs = [added_friends];
    const placeholders = Array.from(
      { length: userIDs.length },
      (_, i) => `$${i + 4}`
    ).join(", ");

    const sqlQuery = `
    SELECT * 
    FROM web.insert_user_crew($1, $2, $3, ${placeholders});
`;
    const values = [userId, crew_name, crew_picture, ...userIDs];
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
   * ! USER :: MODIFY ONE CREW
   * Method to modify a crew
   * @param {InputPatchUser} crewInfo - informations of a crew
   * @returns {Crew} - Crew object with updated informations
   * @returns {500} - if an error occured
   * @async
   */
  async modifyOneCrew(crewInfo) {
    const sqlQuery = `SELECT * FROM web.update_user_crew($1);`;
    const values = [crewInfo];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows[0];
    } catch (err) {
      console.log(err);
      debug(err);
      error = new APIError("Internal error server", 500);
    }
    return { error, result };
  },

  /**
   * ! USER :: DELETE ONE CREW
   * Method to create a user
   * @param {User} userId -  Id of a user
   * @param {User} crewId - Id of another user
   * @returns {500} - if an error occured
   * @async
   */
  async deleteOneCrew(userId, crewId) {
    const sqlQuery = `SELECT * FROM web.delete_user_crew($1,$2)`;
    const values = [userId, crewId];
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

module.exports = crewDatamapper;
