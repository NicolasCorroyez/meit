// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { crewController } = require("../controller");

// ROUTES
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
  /* validationService.isConnected, */ crewController.getAllCrews
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
  /* validationService.isConnected, */ crewController.getOneCrew
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
  /* validationService.isUser("insert"), */ crewController.addOneCrew
);

/**
 * PATCH /user/:userId/crews/:crewId
 * @summary Patch one crew
 * @tags Crew
 * @param {Number} id.path.required - crew identifier
 * @param {InputRegisterUser} request.body.required - crew info for patch - application/json
 * @return {Crew} 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.patch(
  "/:userId(\\d+)/crews/:crewId(\\d+)",
  /* validationService.isConnected,
  validationService.isUser("update"), */
  crewController.modifyOneCrew
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
  crewController.deleteOneCrew
);

module.exports = router;
