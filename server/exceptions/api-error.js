export class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Unauthorized User');
    }

    static BadRequest(message, errors = [] ) {
        return new ApiError(400, message, errors);
    }

    static Forbidden(message = 'Forbidden for you (you are a not admin)') {
        return new ApiError(403, message);
    }
}