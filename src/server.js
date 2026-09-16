import express from 'express'; 
import {config} from "dotenv";
import {connectDB, disconnectDB} from './config/db.js'

//Import Routes
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import leagueRoutes from "./routes/leagueRoutes.js";


config();
connectDB();

const app = express();

//Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));




// API Routes
app.use("/auth", authRoutes)
app.use("/team", teamRoutes)
app.use("/league", leagueRoutes)


const PORT = 5001;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Handle unhandled promise rejections (e.g / database connection errors)
process.on("unhandledRejection", (err) => {
    console.error("unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

//Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

//Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM recieved, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});