import cors from "cors";
import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

console.time("Server startup");
const server = express();
const port = process.env.PORT || 3069;

// ><><><><: MIDDLEWARES :><><><>< \\

server.use(express.json());
server.use(cors());

// ><><><><: ROUTES :><><><>< \\

console.table(listEndpoints(server));

// ><><><><: ERROR MIDDLEWARES :><><><>< \\


// ><><><><: MONGO TIME :><><><>< \\

mongoose.connect(process.env.MONGO_CONNECTION, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to MongoDB 🌵")).then(
	server.listen(port, () => {
		console.log("Running on port", port, "🎇");
		console.timeEnd("Server startup");
	})
);
