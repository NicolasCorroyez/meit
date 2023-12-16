// REQUIRE MODULES
const debug = require("debug")("errorHandler");
const { appendFile } = require("node:fs/promises");
const { join } = require("node:path");
const APIError = require("./APIError");

// ERROR HANDLING MODULE
const errorHandler = {
  /**
   * Method to manage errors
   * @param {*} err
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async manage(err, req, res, next) {
    debug(err);
    errorHandler.log(err);
    debug(err.error);
    res.status(err.code).json({ error: err.message });
  },
  /**
   * Method to save a log file
   * @param {*} err - error which is pass by middleware
   */
  async log(err) {
    const fileName = `${err.date.toISOString().slice(0, 10)}.log`;
    const path = join(__dirname, `../../log/${fileName}`);
    debug(path);

    const time = err.date.toISOString().slice(11, -1);
    let errorMessage;
    if (err.error) {
      errorMessage = err.error.message;
    } else {
      errorMessage = err.message;
    }
    const text = `${time};${errorMessage};${err.stack}\r\n`;
    await appendFile(path, text);
  },
};

module.exports = errorHandler;
