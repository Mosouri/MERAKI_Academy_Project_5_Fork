const example = (socket, next) => {
  if (socket[0] !== "message") {
    next(new Error("socket middleware Error"));
  } else {
    next();
  }
};
module.exports = example;
