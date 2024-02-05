// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { eventController } = require("../controller");

// ROUTES
/**
 * GET
 * @summary Get all user's events
 * @tags Event
 * @param {number} userId.path.required - user identifier
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/events",
  /* validationService.isConnected, */ eventController.getAllEvents
);

/**
 * GET
 * @summary Get one user's event
 * @tags Event
 * @param {number} userId.path.required - user identifier
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/events/:eventId",
  /* validationService.isConnected, */ eventController.getOneEvent
);

/**
 * POST
 * @summary Add a event
 * @tags Event
 * @param {number} userId.path.required - user identifier
 * @param {InputRegisterUser} request.body.required - user info for register - 200 - success response - application/json
 * @return {Event}
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/:userId(\\d+)/events/",
  /* validationService.isUser("insert"), */ eventController.addOneEvent
);

/**
 * PATCH
 * @summary Patch one event
 * @tags Event
 * @param {Number} userId.path.required - event identifier
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
 * DELETE
 * @summary Delete one user's event
 * @tags Event
 * @param {Number} userId.path.required - user identifier
 * @return {boolean} 200 - success response - true
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/:userId(\\d+)/events/",
  /* validationService.isConnected, */
  eventController.deleteOneEvent
);

/**
 * PATCH
 * @summary Patch one event
 * @tags Event
 * @param {Number} userId.path.required - event identifier
 * @param {InputRegisterUser} request.body.required - event info for patch - application/json
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.patch(
  "/:userId(\\d+)/confirm/:eventId(\\d+)",
  /* validationService.isConnected,
  validationService.isUser("update"), */
  eventController.confirmParticipation
);

/**
 * GET UNCONFIRMED
 * @summary Get all user's events
 * @tags Event
 * @param {number} userId.path.required - user identifier
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get(
  "/:userId/unconfirmed",
  /* validationService.isConnected, */ eventController.getAllUnconfirmed
);

module.exports = router;
