// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { crewController } = require("../controller");

// ROUTES
/**
 * GET
 * @summary Get all user's crews
 * @tags Crew
 * @param {number} userId.path.required - user identifier
 * @return {Crew} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/crews",
  /* validationService.isConnected, */ crewController.getAllCrews
);

/**
 * GET
 * @summary Get one user's crew
 * @tags Crew
 * @param {number} userId.path.required - user identifier
 * @return {Crew} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/crews/:crewId",
  /* validationService.isConnected, */ crewController.getOneCrew
);

/**
 * GET
 * @summary Get all user's crews OWNER
 * @tags Crew
 * @param {number} userId.path.required - user identifier
 * @return {Crew} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/owner/:userId/crews",
  /* validationService.isConnected, */ crewController.getAllOwnerCrews
);

/**
 * GET
 * @summary Get all user's crews OWNER
 * @tags Crew
 * @param {number} userId.path.required - user identifier
 * @return {Crew} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/owner/:userId/crews/:crewId",
  /* validationService.isConnected, */ crewController.getOneOwnerCrew
);

/**
 * POST
 * @summary Add a crew
 * @tags Crew
 * @return {Crew}
 * @param {Number} userId.path.required - user identifier
 * @param {InputRegisterUser} request.body.required - user info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/:userId(\\d+)/crews/",
  /* validationService.isUser("insert"), */ crewController.addOneCrew
);

/**
 * PATCH
 * @summary Patch one crew
 * @tags Crew
 * @param {Number} userId.path.required - crew identifier
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
 * DELETE
 * @summary Delete one user's crew
 * @tags Crew
 * @param {Number} userId.path.required - user identifier
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
