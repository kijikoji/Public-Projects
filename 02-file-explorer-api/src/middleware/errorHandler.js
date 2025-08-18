module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};
