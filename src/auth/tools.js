import jwt from "jsonwebtoken"
import { resolve } from "path"
import { promisify } from "util"

import User from "../services/users/schema.js"

export const JWTAuthenticate = async user => {
    const accessToken = await generateJWT({ _id: user._id })
    await user.save()
    return { accessToken }

}
const generateJWT = payload =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2 days" }, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    )

export const verifyJWT = token =>
    new Promise((resolve, reject) =>
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) reject(err)
            resolve(decodedToken)
        })
    )

