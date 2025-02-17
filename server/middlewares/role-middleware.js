import {ApiError} from "../exceptions/api-error.js";

export function isAdmin(req, res, next) {
    try {
        if (req.user?.role !== 'admin') {
            return next(ApiError.Forbidden("You do not have permission to use this route"));
        }
        next()
    } catch (e) {
        return next(ApiError.Unauthorized());
    }
}