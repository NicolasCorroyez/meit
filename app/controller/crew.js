// REQUIRE MODULES
const debug = require("debug")("controller");

//CLASS FOR ERROR
const APIError = require("../service/APIError");

// REQUIRE DATAMAPPER
const { crewDatamapper } = require("../model");

const crewController = {
  /**
   * ! GET ALL CREWS
   * Method to get all crews
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAllCrews(req, res, next) {
    const user = req.params.userId;
    console.log(user);
    const { error, result } = await crewDatamapper.getAllCrews(user);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! GET ONE CREW
   * Method to get one crew
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getOneCrew(req, res, next) {
    console.log(req.params);
    const userId = req.params.userId;
    const crewId = req.params.crewId;
    const { error, result } = await crewDatamapper.getOneCrew(userId, crewId);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! ADD ONE CREW
   * Method to add one crew
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async addOneCrew(req, res, next) {
    const userId = req.params.userId;
    const crewName = req.body.crew_name;
    const crewPicture = req.body.crew_picture;
    const crewMembers = req.body.added_friends;

    console.log(
      "controllers params :",
      userId,
      crewName,
      crewPicture,
      crewMembers
    );

    const { error, result } = await crewDatamapper.addOneCrew(
      userId,
      crewName,
      crewPicture,
      crewMembers
    );
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! MODIFY ONE
   * Method to modify a crew
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async modifyOneCrew(req, res, next) {
    const userId = req.params.userId;
    const crewInfo = req.body;
    console.log("controller : ", userId, crewInfo);
    if (req.body.userId == req.params.userId) {
      const { error, result } = await crewDatamapper.modifyOneCrew(crewInfo);
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
   * ! DELETE ONE CREW
   * Method to delete one crew
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async deleteOneCrew(req, res, next) {
    const userId = parseInt(req.params.userId);
    const userOwner = req.body.userId;
    const crewId = req.body.crew_id_param;
    console.log(userId, userOwner, crewId);
    if (userId !== userOwner) {
      return res
        .status(403)
        .json({ error: "Unauthorized access. userId must match userOwner." });
    }
    const { error, result } = await crewDatamapper.deleteOneCrew(
      userId,
      crewId
    );
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },
};

module.exports = crewController;
