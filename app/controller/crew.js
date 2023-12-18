// REQUIRE MODULES
const debug = require("debug")("controller");

//CLASS FOR ERROR
const APIError = require("../service/APIError");

// REQUIRE DATAMAPPER
const { crewDatamapper } = require("../model");

const crewController = {
  /**
   * ! GET ALL
   * Method to get all crews
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAll(req, res, next) {
    const { error, result } = await crewDatamapper.getAll();
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! GET ONE
   * Method to get a crew by his id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getOne(req, res, next) {
    const { id } = req.params;
    const { error, result } = await crewDatamapper.getOne(id);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! CREATE ONE
   * Method to create a crew
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async createOne(req, res, next) {
    try {
      const { error, result } = await crewDatamapper.createOne(req.body);
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
   * Method to modify a crew
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async modifyOne(req, res, next) {
    const crew = req.body;
    if (req.crew.id == req.params.id) {
      const { error, result } = await crewDatamapper.modifyOne(crew);
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
   * Method to delete a crew
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async deleteOne(req, res, next) {
    if (req.crew.id == req.params.id) {
      const { error, result } = await crewDatamapper.deleteOne(req.params.id);
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

module.exports = crewController;
