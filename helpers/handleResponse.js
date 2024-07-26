class HandleResponse {
    /**
     * Handles a success response by sending a standardized JSON response.
     */
    async handleSuccessResponse(
        code,
        message,
        data,
        res
    ) {
        // Send a standardized success response to the client
        res.status(code).send({
            success: true,
            message,
            code,
            data,
        });
    }

    /**
     * Handles an error response by sending a standardized JSON response with the provided error code and message.
     */
    async handleErrorResponse(code, message, res) {
        // Send a standardized error response to the client
        res.status(code).send({
            success: false,
            error: {
                code,
                message,
            },
        });
    }
}

module.exports = HandleResponse;