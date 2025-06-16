// Define a custom error class `ApiError` that extends the built-in `Error` class.
// This custom error is designed to handle API-related errors with additional context.
class ApiError extends Error {

    constructor(
        statusCode, //The HTTP status code associated with the error.
        message = "Something went wrong", // The error message. Defaults to a generic message.
        errors = [], //An array of additional error details, if any.
        stack = "" //The stack trace of the error. If not provided, it will be auto-generated.
    ) {
        // Call the parent class (Error) constructor with the message.
        super(message);

        // Assign properties to the error instance.
        this.statusCode = statusCode; // HTTP status code for the error.
        this.data = null; // Placeholder for any additional data; currently set to null.
        this.message = message; // Error message (redundantly assigned for clarity).
        this.success = false; // Indicates the operation's success state; always false for errors.
        this.errors = errors; // Array to store additional error details.

        // Assign or generate the stack trace for the error.
        if (stack) {
            this.stack = stack; // Use the provided stack trace if available.
        } else {
            // Generate a stack trace specific to this constructor.
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the `ApiError` class for use in other modules.
export { ApiError };