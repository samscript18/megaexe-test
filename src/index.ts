import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimiter from "express-rate-limit";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import secrets from "./constants/secrets.const";
import { rootRouter } from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error";

// const swaggerDocument = YAML.load("./swagger.yaml");

const app: Express = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(cors());

// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient();

app.use(errorMiddleware);
app.all("*", (req, res, next) => {
  res.status(404).json({ error: "route/method does not exist" });
});

const port = secrets.port;
app.listen(port, () => {
  console.log(`⚡[server]: connected successfully on http://localhost:${port}`);
});
