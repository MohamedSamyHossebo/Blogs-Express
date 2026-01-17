import { config } from "./Config/config.js";
import express from "express";

import { userRouter, authRouter, blogRouter } from "./Modules/index.js";

const bootStrap = () => {
    const app = express();
    app.use(express.json());

    app.use("/users", userRouter);
    app.use("/auth", authRouter);
    app.use("/blogs", blogRouter);
    // Health Check
    app.get("/", (req, res) => {
        res.json({ message: "server works" });
    });


    app.listen(config.PORT, () => {
        console.log(`app listening on port ${config.PORT}`);
    });
}
export default bootStrap;