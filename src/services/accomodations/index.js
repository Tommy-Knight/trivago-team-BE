import { accomodationHost, hostOnly } from "../../auth/host.js"

import Accomodation from "./schema.js";
import { JWTAuthenticate } from "../../auth/tools.js";
import {JWTMiddleware} from "../../auth/middlewares.js"
import createError from "http-errors";
import express from "express";

const accomodationsRouter = express.Router();

//><><><><> POST NEW ACCOMODATION, RETURNS ID <><><><><\\

accomodationsRouter.post("/", JWTMiddleware, hostOnly, async (req, res, next) => {
    try {
        const newAccomodation = new Accomodation(req.body);
        const { _id } = await newAccomodation.save();

        res.status(201).send(_id);
    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            next(createError(400, error));
        } else {
            next(createError(500, "An error occurred while saving accomodations"));
        }
    }
});

//><><><><> GET ALL ACCOMODATIONS <><><><><\\

accomodationsRouter.get("/", JWTMiddleware, async (req, res, next) => {
	try {
		const accomodation = await Accomodation.find({}).populate("user");
		res.send(accomodation);
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while getting accomodations"));
	}
});

//><><><><> GET SPECIFIC ACCOMODATION <><><><><\\

accomodationsRouter.get("/:id", JWTMiddleware, async (req, res, next) => {
	try {
		const id = req.params.id;
		const accomodation = await Accomodation.findById(id).populate("user");
		if (accomodation) {
			res.send(accomodation);
		} else {
			next(createError(404, `Accomodation ${req.params.id} not found`));
		}
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while getting accomodation"));
	}
});

//><><><><> EDIT SPECIFIC ACCOMODATION <><><><><\\

accomodationsRouter.put("/:id", JWTMiddleware, accomodationHost, async (req, res, next) => {
	try {
		const accomodation = await Accomodation.findByIdAndUpdate(req.params.id, req.body, {
			runValidators: true,
			new: true,
		});
		if (accomodation) {
			res.send(accomodation);
		} else {
			next(createError(404, `Accomodation ${req.params.id} not found`));
		}
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while modifying accomodation"));
	}
});

//><><><><> DELETE SPECIFIC ACCOMODATION <><><><><\\

accomodationsRouter.delete("/:id", JWTMiddleware, accomodationHost, async (req, res, next) => {
	try {
		const accomodation = await Accomodation.findByIdAndDelete(req.params.id).populate("user");
		if (accomodation) {
			res.status(204).send();
		} else {
			next(createError(404, `Accomodation ${req.params.id} not found`));
		}
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while deleting Accomodation"));
	}
});

export default accomodationsRouter;
