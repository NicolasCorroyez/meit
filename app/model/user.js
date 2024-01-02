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

const userDatamapper = {
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

  /**
   * ! USER :: GET ONE USER
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
   * ! USER :: CREATE ONE USER
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
   * ! USER :: MODIFY ONE USER
   * Method to modify a user
   * @param {InputPatchUser} userInfo - informations of a user
   * @returns {User} - User object with updated informations
   * @returns {500} - if an error occured
   * @async
   */
  async modifyOne(userInfo) {
    console.log(userInfo);
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
   * ! USER :: DELETE ONE USER
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
   * ! ADMIN :: GET ALL USER'S FRIENDS
   * Method to get all users
   * @returns {[User]} Array of Users objects
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getAllFriends(userId) {
    console.log(userId);
    const sqlQuery = `SELECT * FROM web.get_all_friends($1);`;
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
   * ! USER :: ADD ONE FRIEND
   * Method to create a user
   * @param {User} userId -  Id of a user
   * @param {User} friendId - Id of another user
   * @returns {500} - if an error occured
   * @async
   */
  async addOneFriend(userId, friendId) {
    const sqlQuery = `SELECT * FROM web.add_friend_to_user($1,$2)`;
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
    const sqlQuery = `SELECT * FROM web.delete_friend_from_user($1,$2)`;
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

  // ! CREWS

  /**
   * ! ADMIN :: GET ALL USER'S CREWS
   * Method to get all user's crews
   * @returns {[User]} Array of Users objects
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getAllCrews(userId) {
    console.log(userId);
    const sqlQuery = `SELECT * FROM web.get_user_crews_with_users($1);`;
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
        result = response.rows;
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
   * @param {Event} eventId - Id of another user
   * @returns {500} - if an error occured
   * @async
   */
  async addOneCrew(userId, crew_name, crew_picture, added_friends) {
    console.log(
      "parameters : ",
      userId,
      crew_name,
      crew_picture,
      added_friends
    );
    const userIDs = [added_friends];

    const placeholders = Array.from(
      { length: userIDs.length },
      (_, i) => `$${i + 4}`
    ).join(", ");

    const sqlQuery = `
    SELECT * 
    FROM web.create_crew_for_users($1, $2, $3, ${placeholders});
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
   * @param {InputPatchUser} eventInfo - informations of a crew
   * @returns {Crew} - Event object with updated informations
   * @returns {500} - if an error occured
   * @async
   */
  async modifyOneCrew(crewInfo) {
    console.log("modify crew model : ", crewInfo);
    const sqlQuery = `SELECT * FROM web.update_crew($1);`;
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
    console.log("model: ", userId, crewId);
    const sqlQuery = `SELECT * FROM web.delete_crew_and_links($1,$2)`;
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

  // ! EVENTS

  /**
   * ! ADMIN :: GET ALL USER'S EVENTS
   * Method to get all user's events
   * @returns {[User]} Array of Users objects
   * @returns {404} if no users found
   * @returns {500} if an error occured
   * @async
   */
  async getAllEvents(userId) {
    console.log(userId);
    const sqlQuery = `SELECT * FROM web.get_user_events_with_invitations($1);`;
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
    console.log(userId, eventId);
    const sqlQuery = `SELECT * FROM web.get_user_event_with_invitations($1,$2);`;
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
  FROM web.create_event_for_users($1, $2, $3, $4, $5, $6, ${userPlaceholders}, ${crewPlaceholders});
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
    console.log("model : ", eventInfo);
    const sqlQuery = `SELECT * FROM web.edit_user_event($1);`;
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
    console.log(eventId);
    const sqlQuery = `SELECT * FROM web.delete_event_by_id($1)`;
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

module.exports = userDatamapper;
