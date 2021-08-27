import createError from 'http-errors'

export const hostOnly = (req, res, next) => {
    if (req.user.role === 'host') {
        next()
    } else {
        next(createError(403, "Host only!"))
    }
}