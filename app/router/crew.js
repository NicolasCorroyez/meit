// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { crewController } = require("../controller");

// ROUTES
/**
 * ! GET /crew
 * @summary Get all crews
 * @tags Crew
 * @param {number} id.path.required - crew identifier
 * @return {Crew} 200 - success response - application/json
 * @return {ApiError} 404 - Crew not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/", /* validationService.isConnected, */ crewController.getAll);

/**
 * ! GET /crew/:crewId
 * @summary Get one crew by Id
 * @tags Crew
 * @param {number} id.path.required - crew identifier
 * @return {Crew} 200 - success response - application/json
 * @return {ApiError} 404 - Crew not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:crewId(\\d+)",
  /* validationService.isConnected, */ crewController.getOne
);

/**
 * ! POST /crew
 * @summary Create one crew
 * @tags Crew
 * @return {Crew}
 * @param {InputRegisterCrew} request.body.required - Crew info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/",
  /* validationService.isUser("insert"), */ crewController.createOne
);

/**
 * ! PATCH /crew
 * @summary Patch one crew
 * @tags Crew
 * @param {Number} id.path.required - crew identifier
 * @param {InputRegisterUser} request.body.required - crew info for patch - application/json
 * @return {Crew} 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.patch(
  "/:crewId(\\d+)",
  /* validationService.isConnected,
  validationService.isUser("update"), */
  crewController.modifyOne
);

/**
 * ! DELETE /crew
 * @summary Delete one crew
 * @tags Crew
 * @param {Number} id.path.required - crew identifier
 * @return {boolean} 200 - success response - true
 * @return {ApiError} 404 - Crew not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/:crewId(\\d+)",
  /* validationService.isConnected, */
  crewController.deleteOne
);

module.exports = router;
