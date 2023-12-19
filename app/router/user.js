// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { userController } = require("../controller");

// ROUTES
/**
 * ! GET /user
 * @summary Get all users
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 404 - No user found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/", /* validationService.isConnected, */ userController.getAll);

/**
 * ! GET /user/:userId
 * @summary Get one user
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId",
  /* validationService.isConnected, */ userController.getOne
);

/**
 * ! POST /user
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
 * ! PATCH /user/:userId
 * @summary Patch one user
 * @tags User
 * @param {Number} id.path.required - user identifier
 * @param {InputRegisterUser} request.body.required - user info for patch - application/json
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.patch(
  "/",
  /* validationService.isConnected,
  validationService.isUser("update"), */
  userController.modifyOne
);

/**
 * ! DELETE /user/:userId
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
 * ! POST /login
 * @summary Post user infos
 * @tags User
 * @return {User} 200 - success response - application/json
 * @param {InputLoginUser} request.body.required - user info for login - application/json
 * @return {APIError} 400 - Incorrect mail or password
 * @return {ApiError} 500 - Internal server error
 */
router.post("/login", userController.login);

/**
 * ! GET /user/:userId/friends
 * @summary Get all user's friends
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/friends(\\d+)",
  /* validationService.isConnected, */ userController.getAllFriends
);

/**
 * ! GET /user/:userId/friends/:friendId
 * @summary Get all user's friends
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/friends(\\d+)",
  /* validationService.isConnected, */ userController.getOneFriend
);

/**
 * ! POST /user/:userId/friends/:friendId
 * @summary Add a friend
 * @tags User
 * @return {User}
 * @param {InputRegisterUser} request.body.required - user info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/user/:userId(\\d+)/friend/:friendId(\\d+)",
  /* validationService.isUser("insert"), */ userController.addOneFriend
);

/**
 * ! DELETE /user/:userId/friend/:friendId
 * @summary Delete one friend
 * @tags User
 * @param {Number} id.path.required - user identifier
 * @return {boolean} 200 - success response - true
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/user/:userId(\\d+)/friend/:friendId(\\d+)",
  /* validationService.isConnected, */
  userController.deleteOneFriend
);

module.exports = router;
