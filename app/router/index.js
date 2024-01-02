// REQUIRE MODULES
const express = require("express");

// REQUIRE MIDDLEWARE
const errorHandler = require("../service/errorHandler");

// REQUIRE ROUTERS
const userRouter = require("./user");
const crewRouter = require("./crew");
const eventRouter = require("./event");
const friendRouter = require("./friend");

// DEFINE ROUTER WITH EXPRESS
const mainRouter = express.Router();

// Routing for event routes prefixed by /user
mainRouter.use("/user", eventRouter);

// Routing for crew routes prefixed by /user
mainRouter.use("/user", crewRouter);

// Routing for user routes prefixed by /user
mainRouter.use("/user", userRouter);

// Routing for friend routes prefixed by /user
mainRouter.use("/user", friendRouter);

// Middleware to manage error
mainRouter.use(errorHandler.manage);

module.exports = mainRouter;
