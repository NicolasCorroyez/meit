// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { eventController } = require("../controller");

// ROUTES
/**
 * ! GET /event ADMIN
 * @summary Get all events
 * @tags Event
 * @param {number} id.path.required - event identifier
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 404 - Event not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/", /* validationService.isConnected, */ eventController.getAll);

/**
 * ! GET /event/:eventId ADMIN
 * @summary Get one event by Id
 * @tags Event
 * @param {number} id.path.required - event identifier
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 404 - Event not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:eventId(\\d+)",
  /* validationService.isConnected, */ eventController.getOne
);

/**
 * ! DELETE /event/:eventId ADMIN
 * @summary Delete one event
 * @tags Event
 * @param {Number} id.path.required - event identifier
 * @return {boolean} 200 - success response - true
 * @return {ApiError} 404 - Event not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/:eventId(\\d+)",
  /* validationService.isConnected, */
  eventController.deleteOne
);

module.exports = router;
