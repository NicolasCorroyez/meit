// CLASS TO CREATE AN ERROR
class APIError extends Error {
  constructor(message, code, err) {
    super(message);
    if (err) {
      this.error = err;
    }
    this.code = code;
    this.date = new Date();
  }
}

module.exports = APIError;
