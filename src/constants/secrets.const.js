"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const secrets = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
};
exports.default = secrets;
