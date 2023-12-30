// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { userController } = require("../controller");

// ROUTES
/**
 * ! ADMIN :: GET /user
 * @summary Get all users
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 404 - No user found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/", /* validationService.isConnected, */ userController.getAll);

/**
 * GET /user/:userId
 * @summary Get one user
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId(\\d+)",
  /* validationService.isConnected, */ userController.getOne
);

/**
 * POST /user
 * @summary Post one user
 * @tags User
 * @return {User}
 * @param {InputRegisterUser} request.body.required - user info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/",
  /* validationService.isUser("insert"), */ userController.createOne
);

/**
 * PATCH /user/:userId
 * @summary Patch one user
 * @tags User
 * @param {Number} id.path.required - user identifier
 * @param {InputRegisterUser} request.body.required - user info for patch - application/json
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.patch(
  "/:userId(\\d+)",
  /* validationService.isConnected,
  validationService.isUser("update"), */
  userController.modifyOne
);

/**
 * DELETE /user/:userId
 * @summary Delete one user
 * @tags User
 * @param {Number} id.path.required - user identifier
 * @return {boolean} 200 - success response - true
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/:userId(\\d+)",
  /* validationService.isConnected, */
  userController.deleteOne
);

/**
 * POST /login TO DO
 * @summary Post user infos
 * @tags User
 * @return {User} 200 - success response - application/json
 * @param {InputLoginUser} request.body.required - user info for login - application/json
 * @return {APIError} 400 - Incorrect mail or password
 * @return {ApiError} 500 - Internal server error
 */
router.post("/login", userController.login);

// ! **************************
// ! ** FRIENDS RELATIONSHIP **
// ! **************************

/**
 * GET /user/:userId/friends
 * @summary Get all user's friends
 * @tags Friend
 * @param {number} id.path.required - user identifier
 * @return {Friend} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/friends",
  /* validationService.isConnected, */ userController.getAllFriends
);

/**
 * GET /user/:userId/friends/:friendId
 * @summary Get one user's friends
 * @tags Friend
 * @param {number} id.path.required - user identifier
 * @return {Friend} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/friends/:friendId",
  /* validationService.isConnected, */ userController.getOneFriend
);

/**
 * POST /user/:userId/friends/
 * @summary Add a friend
 * @tags Friend
 * @return {Friend}
 * @param {InputRegisterUser} request.body.required - user info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/:userId(\\d+)/friends/",
  /* validationService.isUser("insert"), */ userController.addOneFriend
);

/**
 * DELETE /user/:userId/friend/:friendId
 * @summary Delete one friend
 * @tags User
 * @param {Number} id.path.required - user identifier
 * @return {boolean} 200 - success response - true
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/:userId(\\d+)/friends/",
  /* validationService.isConnected, */
  userController.deleteOneFriend
);

// ! ********************
// ! *****  CREWS  ******
// ! ********************

/**
 * GET /user/:userId/crews
 * @summary Get all user's crews
 * @tags Crew
 * @param {number} id.path.required - user identifier
 * @return {Crew} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/crews",
  /* validationService.isConnected, */ userController.getAllCrews
);

/**
 * GET /user/:userId/crews/:crewId
 * @summary Get one user's crew
 * @tags Crew
 * @param {number} id.path.required - user identifier
 * @return {Crew} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/crews/:crewId",
  /* validationService.isConnected, */ userController.getOneCrew
);

/**
 * POST /user/:userId/crews/
 * @summary Add a crew
 * @tags Crew
 * @return {Crew}
 * @param {InputRegisterUser} request.body.required - user info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/:userId(\\d+)/crews/",
  /* validationService.isUser("insert"), */ userController.addOneCrew
);

/**
 * DELETE /user/:userId/crews/:crewId
 * @summary Delete one user's crew
 * @tags Crew
 * @param {Number} id.path.required - user identifier
 * @return {boolean} 200 - success response - true
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/:userId(\\d+)/crews/",
  /* validationService.isConnected, */
  userController.deleteOneCrew
);

// ! ********************
// ! *****  EVENTS  *****
// ! ********************

/**
 * GET /user/:userId/events
 * @summary Get all user's events
 * @tags Event
 * @param {number} id.path.required - user identifier
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/events",
  /* validationService.isConnected, */ userController.getAllEvents
);

/**
 * GET /user/:userId/events/:eventId
 * @summary Get one user's event
 * @tags Event
 * @param {number} id.path.required - user identifier
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/events/:eventId",
  /* validationService.isConnected, */ userController.getOneEvent
);

/**
 * POST /user/:userId/events/
 * @summary Add a event
 * @tags Event
 * @return {Event}
 * @param {InputRegisterUser} request.body.required - user info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/:userId(\\d+)/events/",
  /* validationService.isUser("insert"), */ userController.addOneEvent
);

/**
 * PATCH /user/:userId/events/:eventId
 * @summary Patch one event
 * @tags Event
 * @param {Number} id.path.required - event identifier
 * @param {InputRegisterUser} request.body.required - event info for patch - application/json
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.patch(
  "/:userId(\\d+)/events/:eventId(\\d+)",
  /* validationService.isConnected,
  validationService.isUser("update"), */
  userController.modifyOneEvent
);

/**
 * DELETE /user/:userId/events/
 * @summary Delete one user's event
 * @tags Event
 * @param {Number} id.path.required - user identifier
 * @return {boolean} 200 - success response - true
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/:userId(\\d+)/events/",
  /* validationService.isConnected, */
  userController.deleteOneEvent
);

module.exports = router;
