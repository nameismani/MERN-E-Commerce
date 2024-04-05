const { isValidObjectId } = require("mongoose");

function checkId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    return next(`Invalid Object of: ${req.params.id}`);
    // throw new Error(`Invalid Object of: ${req.params.id}`);
  }
  next();
}

module.exports = checkId;
