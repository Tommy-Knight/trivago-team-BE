import Accomodation from "./schema.js";
import createError from "http-errors";
import express from "express";

const accomodationsRouter = express.Router();

//><><><><> POST NEW ACCOMODATION, RETURNS ID <><><><><\\

accomodationsRouter.post("/", async (req, res, next) => {
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

accomodationsRouter.get("/", async (req, res, next) => {
	try {
		const blogs = await Accomodation.find({}).populate("user");
		res.send(blogs);
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while getting accomodations"));
	}
});

//><><><><> GET SPECIFIC ACCOMODATION <><><><><\\

accomodationsRouter.get("/:id", async (req, res, next) => {
	try {
		const id = req.params.id;
		const blog = await Accomodation.findById(id).populate("user");
		if (blog) {
			res.send(blog);
		} else {
			next(createError(404, `Blog ${req.params.id} not found`));
		}
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while getting blog"));
	}
});

//><><><><> EDIT SPECIFIC ACCOMODATION <><><><><\\

accomodationsRouter.put("/:id", async (req, res, next) => {
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

accomodationsRouter.delete("/:id", async (req, res, next) => {
	try {
		const blog = await Accomodation.findByIdAndDelete(req.params.id);
		if (blog) {
			res.status(204).send();
		} else {
			next(createError(404, `Student ${req.params.id} not found`));
		}
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while deleting student"));
	}
});

export default accomodationsRouter;
