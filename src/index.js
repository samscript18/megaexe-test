"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const secrets_const_1 = __importDefault(require("./constants/secrets.const"));
const routes_1 = require("./routes");
const client_1 = require("@prisma/client");
const error_1 = require("./middlewares/error");
// const swaggerDocument = YAML.load("./swagger.yaml");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api", routes_1.rootRouter);
exports.prismaClient = new client_1.PrismaClient();
app.use(error_1.errorMiddleware);
app.all("*", (req, res, next) => {
    res.status(404).json({ error: "route/method does not exist" });
});
const port = secrets_const_1.default.port;
app.listen(port, () => {
    console.log(`⚡[server]: connected successfully on http://localhost:${port}`);
});
