import createError from "http-errors"
import UserModel from "../services/users/schema.js"
import { verifyJWT } from "./tools.js"

export const JWTMiddleware = async (req, res, next) => {
    if (!req.header.authorization) {
        next(createError(401, "Provide authorization header!"))
    } else {
        try {
            const token = req.headers.authorization.replace("Bearer ", "")

            const decodedToken = await verifyJWT(token)

            const user = await UserModel.findById(decodedToken._id)

            if (user) {
                req.user = user
                next()
            } else {
                next(createError(404, "user not found!"))
            }

        } catch (error) {
            next(createError(401, "Token expired!"))
        }
    }
}