const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Wrap the request handler in a Promise. If it resolves, the request continues as usual.
        // If it rejects (throws an error), the error is caught and passed to `next(err)`.
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

// Exporting the function so it can be reused in other parts of the application
export { asyncHandler };