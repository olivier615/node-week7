function handelSuccess (res, data) {
  res.status(200).send({
    statue: 'success',
    data
  })
}

module.exports = handelSuccess