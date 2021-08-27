import jwt from "jsonwebtoken"
import { resolve } from "path"
import { promisify } from "util"

import UserModel from "../users/schema.js"

export const JWTAuthenticate = async user => {
    const accessToken = await generateJWT({ _id: user._id })

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

