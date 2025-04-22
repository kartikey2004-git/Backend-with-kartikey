class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [], 

    // This is an array to hold additional error details (like validation errors or specific error codes).

    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null; 
    this.message = message;
    this.success = false;
    this.errors = errors;

    // This checks whether the stack variable has a value (it’s truthy).

    // This is typically done to see if a stack trace has already been provided, such as when you're manually passing a stack trace to a custom error object.

    if (stack) {
      this.stack = stack;
    } 
    
    // If the stack variable is falsy (i.e., it's null, undefined, or some other falsy value), then it falls back to automatically generating the stack trace.
    
    else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError }


// great way to standardize error handling in an API

// defines a custom error class ApiError that extends JavaScript's built-in Error class.

// Stack trace provides information about the sequence of function calls leading to an error

// this.data field ke andar hota kya hai wo documentation se padhna hai

