// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { friendController } = require("../controller");

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
  /* validationService.isConnected, */ friendController.getAllFriends
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
  /* validationService.isConnected, */ friendController.getOneFriend
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
  /* validationService.isUser("insert"), */ friendController.addOneFriend
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
  friendController.deleteOneFriend
);

module.exports = router;
