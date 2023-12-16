// REQUIRE MODULES
const express = require("express");
const router = express.Router();

// MIDDLEWARE
/* const validationService = require("../service/validation/validationService"); */

//CONTROLLER
const { eventController } = require("../controller");

// ROUTES
/**
 * ! GET /event
 * @summary Get all events
 * @tags Event
 * @param {number} id.path.required - event identifier
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 404 - Event not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/", /* validationService.isConnected, */ eventController.getAll);

/**
 * ! GET /event/:eventId
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
 * ! POST /event
 * @summary Create one event
 * @tags Event
 * @return {Event}
 * @param {InputRegisterCrew} request.body.required - Event info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/",
  /* validationService.isUser("insert"), */ eventController.createOne
);

/**
 * ! PATCH /event/:eventId
 * @summary Patch one event
 * @tags Event
 * @param {Number} id.path.required - event identifier
 * @param {InputRegisterUser} request.body.required - event info for patch - application/json
 * @return {Event} 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.patch(
  "/:eventId(\\d+)",
  /* validationService.isConnected,
  validationService.isUser("update"), */
  eventController.modifyOne
);

/**
 * ! DELETE /event/:eventId
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

/**
 * ! POST INVITE FRIEND /event/:eventId/invite/:userId
 * @summary Invite friend to event
 * @tags Invite
 * @return {Invite}
 * @param {InputRegisterCrew} request.body.required - Invite info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/event/:eventId(\\d+)/invite/:userId(\\d+)",
  /* validationService.isUser("insert"), */ eventController.inviteUser
);

/**
 * ! POST INVITE CREW /event/:eventId/invite/:userId
 * @summary Invite crew to event
 * @tags Invite
 * @return {Invite}
 * @param {InputRegisterCrew} request.body.required - Invite info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/event/:eventId(\\d+)/invite/crew/:crewId(\\d+)",
  /* validationService.isUser("insert"), */ eventController.inviteCrew
);

module.exports = router;
