import { StatusCodes } from "http-status-codes";
import AppError from "../error/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const parseBody = catchAsync(async (req, res, next) => {
    // Check if the 'data' key is present in the body
    if (!req.body.data) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Please provide data in the body under data key');
    }

    // Check if 'data' is a stringified JSON, if yes, parse it
    if (typeof req.body.data === 'string') {
        req.body = JSON.parse(req.body.data);
    } else {
        req.body = req.body.data;
    }

    // Continue to the next middleware/route handler
    next();
});
