// REQUIRE MODULES
const express = require("express");

// REQUIRE MIDDLEWARE
const errorHandler = require("../service/errorHandler");

// REQUIRE ROUTERS
const userRouter = require("./user");
const crewRouter = require("./crew");
const eventRouter = require("./event");

// DEFINE ROUTER WITH EXPRESS
const mainRouter = express.Router();

// Routing for routes prefixed by /events
mainRouter.use("/events", eventRouter);

// Routing for routes prefixed by /crews
mainRouter.use("/crews", crewRouter);

// Routing for routes prefixed by /users
mainRouter.use("/users", userRouter);

// Middleware to manage error
mainRouter.use(errorHandler.manage);

module.exports = mainRouter;
