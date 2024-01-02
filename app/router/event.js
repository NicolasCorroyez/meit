// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { eventController } = require("../controller");

// ROUTES
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
  /* validationService.isConnected, */ eventController.getAllEvents
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
  /* validationService.isConnected, */ eventController.getOneEvent
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
  /* validationService.isUser("insert"), */ eventController.addOneEvent
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
  eventController.modifyOneEvent
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
  eventController.deleteOneEvent
);

module.exports = router;
