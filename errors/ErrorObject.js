class ErrorObject extends Error {
  constructor(statusCode, name, message, errorObj) {
    super(message);
    this.name = name || 'Error';
    this.statusCode = statusCode || 500;
    this.errorObj = errorObj || null;
    this.msg = message || '';
  }
}

module.exports = ErrorObject;
