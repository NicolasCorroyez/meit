// REQUIRE MODULES
const debug = require("debug")("controller");

//CLASS FOR ERROR
const APIError = require("../service/APIError");

// REQUIRE DATAMAPPER
const { friendDatamapper } = require("../model");

const friendController = {
  /**
   * ! GET ALL FRIENDS
   * Method to get all friend
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAllFriends(req, res, next) {
    const user = req.params.userId;
    const { error, result } = await friendDatamapper.getAllFriends(user);
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
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const { error, result } = await friendDatamapper.getOneFriend(
      userId,
      friendId
    );
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
    const userId = req.params.userId;
    const friendId = req.body.friendId;
    const { error, result } = await friendDatamapper.addOneFriend(
      userId,
      friendId
    );
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
    const userId = req.params.userId;
    const friendId = req.body.friendId;
    const { error, result } = await friendDatamapper.deleteOneFriend(
      userId,
      friendId
    );
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! GET ALL PENDING FRIENDSHIP
   * Method to get all friend
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAllPendingFriendship(req, res, next) {
    const user = req.params.userId;
    console.log(user);
    const { error, result } = await friendDatamapper.getAllPendingFriendship(
      user
    );
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * ! MODIFY ONE
   * Method to modify a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async confirmOneFriendship(req, res, next) {
    const user = req.params.userId;
    const friend = req.params.friendId;
    const { error, result } = await friendDatamapper.confirmOneFriendship(
      user,
      friend
    );
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },
};

module.exports = friendController;
