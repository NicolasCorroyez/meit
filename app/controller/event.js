// REQUIRE MODULES
const debug = require("debug")("controller");

//CLASS FOR ERROR
const APIError = require("../service/APIError");

// REQUIRE DATAMAPPER
const { eventDatamapper } = require("../model");

const eventController = {
  /**
   * ! GET ALL events
   * Method to get all events of a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAll(req, res, next) {
    const { id } = req.params;
    const { error, result } = await eventDatamapper.getAll(id);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! GET ONE
   * Method to get a event by his id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getOne(req, res, next) {
    const { id } = req.params;
    const { error, result } = await eventDatamapper.getOne(id);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! CREATE ONE
   * Method to create a event
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async createOne(req, res, next) {
    try {
      const { error, result } = await eventDatamapper.createOne(req.body);
      if (error) {
        next(error);
      } else {
        res.json(result);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * ! MODIFY ONE
   * Method to modify a event
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async modifyOne(req, res, next) {
    const event = req.body;
    if (req.event.id == req.params.id) {
      const { error, result } = await eventDatamapper.modifyOne(event);
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
   * ! DELETE ONE
   * Method to delete a event
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async deleteOne(req, res, next) {
    if (req.event.id == req.params.id) {
      const { error, result } = await eventDatamapper.deleteOne(req.params.id);
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
};

module.exports = eventController;
