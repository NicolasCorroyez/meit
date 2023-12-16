// REQUIRE MODULES
const express = require("express");

// REQUIRE MIDDLEWARE
const errorHandler = require("../service/errorHandler");

// REQUIRE ROUTERS
const userRouter = require("./user");
const crewRouter = require("./booking");
const requestRouter = require("./hostel");

// DEFINE ROUTER WITH EXPRESS
const mainRouter = express.Router();

// Routing for routes prefixed by /request
mainRouter.use("/request", requestRouter);

// Routing for routes prefixed by /crew
mainRouter.use("/crew", crewRouter);

// Routing for routes prefixed by /user
mainRouter.use("/user", userRouter);

// Middleware to manage error
mainRouter.use(errorHandler.manage);

module.exports = mainRouter;
