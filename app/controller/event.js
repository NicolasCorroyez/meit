const debug = require("debug")("controller");
const APIError = require("../service/APIError");
const { eventDatamapper } = require("../model");

const eventController = {
  async getAllEvents(req, res, next) {
    const userId = req.params.userId;
    const { error, result } = await eventDatamapper.getAllEvents(userId);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  async getOneEvent(req, res, next) {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    console.log(userId);
    console.log(eventId);
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

  async addOneEvent(req, res, next) {
    const userId = req.params.userId;
    const eventData = req.body;
    const { error, result } = await eventDatamapper.addOneEvent(
      userId,
      eventData
    );
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  async modifyOneEvent(req, res, next) {
    const userId = parseInt(req.params.userId);
    const eventInfo = req.body;
    if (eventInfo.userId === userId) {
      const { error, result } = await eventDatamapper.modifyOneEvent(eventInfo);
      if (error) {
        next(error);
      } else {
        res.json(result);
      }
    } else {
      const err = new APIError("Access denied", 403);
      next(err);
    }
  },

  async deleteOneEvent(req, res, next) {
    const userId = parseInt(req.params.userId);
    const userOwner = req.body.userId;
    const eventId = req.body.eventId;
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
