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

const friendDatamapper = {
  /**
   * ! USER :: GET ALL USER'S FRIENDS
   * Method to get all users
   * @returns {[User]} Array of Users objects
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getAllFriends(userId) {
    const sqlQuery = `SELECT * FROM web.get_user_all_friends($1);`;
    const values = [userId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows.length == 0) {
        error = new APIError("No friends found", 404);
      } else {
        result = response.rows;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * ! USER :: GET ONE USER'S FRIEND
   * Method to get all users
   * @returns {User} User object
   * @param {User} userId -  Id of a user
   * @param {User} friendId - Id of another user
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getOneFriend(userId, friendId) {
    const sqlQuery = `SELECT * FROM web.get_user_one_friend($1,$2);`;
    const values = [userId, friendId];
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
   * ! USER :: ADD ONE FRIEND
   * Method to create a user
   * @param {User} userId -  Id of a user
   * @param {User} friendId - Id of another user
   * @returns {500} - if an error occured
   * @async
   */
  async addOneFriend(userId, friendId) {
    const sqlQuery = `SELECT * FROM web.insert_user_friend($1,$2)`;
    const values = [userId, friendId];
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
   * ! USER :: DELETE ONE FRIEND
   * Method to create a user
   * @param {User} userId -  Id of a user
   * @param {User} friendId - Id of another user
   * @returns {500} - if an error occured
   * @async
   */
  async deleteOneFriend(userId, friendId) {
    const sqlQuery = `SELECT * FROM web.delete_user_friend($1,$2)`;
    const values = [userId, friendId];
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

module.exports = friendDatamapper;
