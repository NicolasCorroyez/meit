// REQUIRE MODULES
const debug = require("debug")("controller");

//CLASS FOR ERROR
const APIError = require("../service/APIError");

// REQUIRE DATAMAPPER
const { userDatamapper } = require("../model");

const userController = {
  /**
   * ! GET ALL
   * Method to get all users
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAll(req, res, next) {
    const { error, result } = await userDatamapper.getAll();
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! GET ONE
   * Method to get a user by his id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getOne(req, res, next) {
    const { userId } = req.params;
    const { error, result } = await userDatamapper.getOne(userId);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! CREATE ONE
   * Method to create a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async createOne(req, res, next) {
    try {
      const { error, result } = await userDatamapper.createOne(req.body);
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
   * Method to modify a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async modifyOne(req, res, next) {
    const user = req.body;
    if (req.body.id == req.params.userId) {
      const { error, result } = await userDatamapper.modifyOne(user);
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
   * Method to delete a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async deleteOne(req, res, next) {
    if (req.body.id == req.params.userId) {
      const { error, result } = await userDatamapper.deleteOne(
        req.params.userId
      );
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
   * ! LOGIN
   * Method to login
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async login(req, res, next) {
    //! TO DO
  },

  /**
   * ! GET ALL FRIENDS
   * Method to get all friend
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAllFriends(req, res, next) {
    const { error, result } = await userDatamapper.getAllFriends();
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! GET ONE FRIEND
   * Method to get one friend
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getOneFriend(req, res, next) {
    const { error, result } = await userDatamapper.getOneFriend();
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! ADD ONE FRIEND
   * Method to add one friend
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async addOneFriend(req, res, next) {
    const { error, result } = await userDatamapper.addOneFriend();
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! DELETE ONE FRIEND
   * Method to delete one friend
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async deleteOneFriend(req, res, next) {
    const { error, result } = await userDatamapper.deleteOneFriend();
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },
};

module.exports = userController;
