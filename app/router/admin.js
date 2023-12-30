// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const adminController = require("../controller/admin.js");

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
router.get(
  "/user",
  /* validationService.isConnected, */ adminController.getAll
);

module.exports = router;
