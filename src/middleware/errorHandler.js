module.exports = (err, req, res, next) => {
  if (!err) return next()

  if (process.env.NODE_ENV !== 'development') delete err.stack
  console.error(err)

  res
    .status(err.status || 500)
    .send(err)
}
