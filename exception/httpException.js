function HttpException(statusCode, message) {
  return {
    statusCode,
    message,
  };
}

module.exports = HttpException;
