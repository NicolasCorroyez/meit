// REQUIRE MODULES
const debug = require("debug")("controller");

//CLASS FOR ERROR
const APIError = require("../service/APIError");

// REQUIRE DATAMAPPER
const { adminDatamapper } = require("../model/admin.js");

const adminController = {
  /**
   * ! GET ALL
   * Method to get all users
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAll(req, res, next) {
    const { error, result } = await adminDatamapper.getAll();
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },
};

module.exports = adminController;
