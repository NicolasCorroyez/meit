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
    const user = req.params.userId;
    console.log(user);
    const { error, result } = await userDatamapper.getAllFriends(user);
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
    console.log(req.params);
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const { error, result } = await userDatamapper.getOneFriend(
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
    const { error, result } = await userDatamapper.addOneFriend(
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
    const { error, result } = await userDatamapper.deleteOneFriend(
      userId,
      friendId
    );
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  // ! CREWS

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
    const { error, result } = await userDatamapper.getAllCrews(user);
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
    const { error, result } = await userDatamapper.getOneCrew(userId, crewId);
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

    const { error, result } = await userDatamapper.addOneCrew(
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
   * ! DELETE ONE CREW
   * Method to delete one crew
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async deleteOneCrew(req, res, next) {
    const userId = parseInt(req.params.userId);
    const userOwner = req.body.userId;
    const crewId = req.body.crewId;
    console.log(userId, userOwner, crewId);
    if (userId !== userOwner) {
      return res
        .status(403)
        .json({ error: "Unauthorized access. userId must match userOwner." });
    }
    const { error, result } = await userDatamapper.deleteOneCrew(crewId);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  // ! EVENTS

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
    const { error, result } = await userDatamapper.getAllEvents(user);
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
    const { error, result } = await userDatamapper.getOneEvent(userId, eventId);
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

    const { error, result } = await userDatamapper.addOneEvent(
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
    console.log(userId, eventInfo);
    if (req.body.userId == req.params.userId) {
      const { error, result } = await userDatamapper.modifyOneEvent(eventInfo);
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
    const crewId = req.body.eventId;
    console.log(userId, userOwner, crewId);
    if (userId !== userOwner) {
      return res
        .status(403)
        .json({ error: "Unauthorized access. userId must match userOwner." });
    }
    const { error, result } = await userDatamapper.deleteOneEvent(crewId);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },
};

module.exports = userController;
