// REQUIRE MODULES
const express = require("express");

// REQUIRE MIDDLEWARE
const errorHandler = require("../service/errorHandler");

// REQUIRE ROUTERS
const usersRouter = require("./users");
const crewsRouter = require("./booking");
const eventsRouter = require("./hostel");

// DEFINE ROUTER WITH EXPRESS
const mainRouter = express.Router();

// Routing for routes prefixed by /events
mainRouter.use("/events", eventsRouter);

// Routing for routes prefixed by /crews
mainRouter.use("/crews", crewsRouter);

// Routing for routes prefixed by /users
mainRouter.use("/users", usersRouter);

// Middleware to manage error
mainRouter.use(errorHandler.manage);

module.exports = mainRouter;
