/**
 * Wraps async controller functions to avoid repetitive try/catch blocks.
 * If the promise rejects, it passes the error to the next() middleware.
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
