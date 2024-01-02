// REQUIRE MODULES
const debug = require("debug")("controller");

//CLASS FOR ERROR
const APIError = require("../service/APIError");

// REQUIRE DATAMAPPER
const { eventDatamapper } = require("../model");

const eventController = {
  /**
   * ! GET ALL EVENTS
   * Method to get all events
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAllEvents(req, res, next) {
    const user = req.params.userId;
    console.log(user);
    const { error, result } = await eventDatamapper.getAllEvents(user);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! GET ONE EVENT
   * Method to get one crew
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getOneEvent(req, res, next) {
    console.log(req.params);
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    const { error, result } = await eventDatamapper.getOneEvent(
      userId,
      eventId
    );
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! ADD ONE EVENT
   * Method to add one crew
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async addOneEvent(req, res, next) {
    const userId = req.params.userId;
    const {
      theme,
      date,
      time,
      place,
      nb_people,
      invited_users_ids,
      invited_crews_ids,
    } = req.body;

    console.log(
      "controllers params :",
      userId,
      theme,
      date,
      time,
      place,
      nb_people,
      invited_users_ids,
      invited_crews_ids
    );

    const { error, result } = await eventDatamapper.addOneEvent(
      userId,
      theme,
      date,
      time,
      place,
      nb_people,
      invited_users_ids,
      invited_crews_ids
    );
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! MODIFY ONE
   * Method to modify a event
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async modifyOneEvent(req, res, next) {
    const userId = req.params.userId;
    const eventInfo = req.body;
    console.log("controller : ", userId, eventInfo);
    if (req.body.userId == req.params.userId) {
      const { error, result } = await eventDatamapper.modifyOneEvent(eventInfo);
      if (error) {
        next(error);
      } else {
        res.json(result);
      }
    } else {
      const err = new APIError("Acces denied", 404);
      next(err);
    }
  },

  /**
   * ! DELETE ONE EVENT
   * Method to delete one event
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async deleteOneEvent(req, res, next) {
    const userId = parseInt(req.params.userId);
    const userOwner = req.body.userId;
    const eventId = req.body.eventId;
    console.log(userId, userOwner, eventId);
    if (userId !== userOwner) {
      return res
        .status(403)
        .json({ error: "Unauthorized access. userId must match userOwner." });
    }
    const { error, result } = await eventDatamapper.deleteOneEvent(eventId);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },
};

module.exports = eventController;
