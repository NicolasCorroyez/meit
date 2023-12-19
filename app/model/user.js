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

const userDatamapper = {
  /**
   * ! GET ALL USERS
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

  /**
   * ! GET ONE USER
   * Method to get a user by his id
   * @param {int} userId - id of a user
   * @returns {User} - User object
   * @returns {404} - if a user do not exist
   * @returns {500} - if an error occured
   * @async
   */
  async getOne(userId) {
    const sqlQuery = `SELECT * FROM web.get_one_user($1)`;
    const values = [userId];
    console.log("this is values", userId);
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows[0];
    } catch (err) {
      error = new APIError("Internal error server", 500);
    }
    if (result.length === 0 /* || result.id === null */) {
      console.log("model error");
      error = new APIError("User not found", 404);
    }
    return { error, result };
  },

  /**
   * ! CREATE ONE USER
   * Method to create a user
   * @param {InputRegisterUser} user - informations of a user
   * @returns {500} - if an error occured
   * @async
   */
  async createOne(user) {
    const sqlQuery = `SELECT * FROM web.insert_user($1)`;
    const values = [user];
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
   * ! MODIFY ONE USER
   * Method to modify a user
   * @param {InputPatchUser} userInfo - informations of a user
   * @returns {User} - User object with updated informations
   * @returns {500} - if an error occured
   * @async
   */
  async modifyOne(userInfo) {
    const sqlQuery = `SELECT * FROM web.update_user($1)`;
    const values = [userInfo];
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
   * ! DELETE ONE USER
   * Method to delete a user
   * @param {int} userId - id of a user
   * @returns {boolean} - true if a user has been deleted
   * @returns {404} - if a user do not exist
   * @returns {500} - if an error occured
   * @async
   */
  async deleteOne(userId) {
    const sqlQuery = `SELECT * FROM web.delete_user($1);`;
    const values = [userId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows == false) {
        error = new APIError("User not found", 404);
      } else {
        result = true;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * ! TO DO
   * Method to log a user
   * @param {InputLoginUser} user - user mail
   * @returns {User} - user information
   * @returns {400} - if incorrect email or password
   * @returns {500} - if an error occured
   * @async
   */
  async checkUser(user) {},

  /**
   * ! GET ALL USER'S FRIENDS
   * Method to get all users
   * @returns {[User]} Array of Users objects
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getAllFriends(userId) {
    const sqlQuery = `SELECT * FROM web.get_all_friends($1);`;
    const values = [userId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
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

  /**
   * ! GET ONE USER'S FRIEND
   * Method to get all users
   * @returns {User} User object
   * @param {User} userId -  Id of a user
   * @param {User} friendId - Id of another user
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getOneFriend(userId, friendId) {
    const sqlQuery = `SELECT * FROM web.get_one_friend($1,$2);`;
    const values = [userId, friendId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
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

  /**
   * ! ADD ONE FRIEND
   * Method to create a user
   * @param {User} userId -  Id of a user
   * @param {User} friendId - Id of another user
   * @returns {500} - if an error occured
   * @async
   */
  async addOneFriend(userId, friendId) {
    const sqlQuery = `SELECT * FROM web.add_one_friend($1,$2)`;
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
   * ! DELETE ONE FRIEND
   * Method to create a user
   * @param {User} userId -  Id of a user
   * @param {User} friendId - Id of another user
   * @returns {500} - if an error occured
   * @async
   */
  async deleteOneFriend(userId, friendId) {
    const sqlQuery = `SELECT * FROM web.delete_one_friend($1,$2)`;
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

module.exports = userDatamapper;
