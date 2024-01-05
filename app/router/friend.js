// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { friendController } = require("../controller");

/**
 * GET
 * @summary Get all one user's friends
 * @tags Friend
 * @param {number} userId.path.required - user identifier
 * @return {Friend} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/friends",
  /* validationService.isConnected, */ friendController.getAllFriends
);

/**
 * GET
 * @summary Get one user's friends
 * @tags Friend
 * @param {number} userId.path.required - user identifier
 * @return {Friend} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/friends/:friendId",
  /* validationService.isConnected, */ friendController.getOneFriend
);

/**
 * POST
 * @summary Add a friend
 * @tags Friend
 * @return {Friend}
 * @param {number} userId.path.required - user identifier
 * @param {InputRegisterUser} request.body.required - user info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/:userId(\\d+)/friends/",
  /* validationService.isUser("insert"), */ friendController.addOneFriend
);

/**
 * DELETE
 * @summary Delete one friend
 * @tags User
 * @param {Number} userId.path.required - user identifier
 * @return {boolean} 200 - success response - true
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/:userId(\\d+)/friends/",
  /* validationService.isConnected, */
  friendController.deleteOneFriend
);

/**
 * GET
 * @summary Get all one user's friendship request pending
 * @tags Friend
 * @param {Number} userId.path.required - user identifier
 * @return {Friend} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/friendship/pending",
  /* validationService.isConnected, */ friendController.getAllPendingFriendship
);

/**
 * PATCH
 * @summary Patch one friendship request pending
 * @tags Friend
 * @param {Number} userId.path.required - user identifier
 * @param {Number} friendId.path.required - friend identifier
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.patch(
  "/:userId(\\d+)/friendship/confirm/:friendId(\\d+)",
  /* validationService.isConnected,
  validationService.isUser("update"), */
  friendController.confirmOneFriendship
);

module.exports = router;
