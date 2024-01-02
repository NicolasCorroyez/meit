// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { userController } = require("../controller");

// ROUTES
/**
 * GET
 * @summary Get all users
 * @tags User
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 404 - No user found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/", /* validationService.isConnected, */ userController.getAll);

/**
 * GET
 * @summary Get one user
 * @tags User
 * @param {number} userId.path.required - user identifier
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId(\\d+)",
  /* validationService.isConnected, */ userController.getOne
);

/**
 * POST
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
 * PATCH
 * @summary Patch one user
 * @tags User
 * @param {Number} userId.path.required - user identifier
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
 * DELETE
 * @summary Delete one user
 * @tags User
 * @param {Number} userId.path.required - user identifier
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
 * POST // ! TO DO
 * @summary Post user infos
 * @tags User
 * @return {User} 200 - success response - application/json
 * @param {InputLoginUser} request.body.required - user info for login - application/json
 * @return {APIError} 400 - Incorrect mail or password
 * @return {ApiError} 500 - Internal server error
 */
router.post("/login", userController.login);

module.exports = router;
