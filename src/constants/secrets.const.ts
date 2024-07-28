import { config } from "dotenv";

config();
const secrets = {
  port: <number | string>process.env.PORT,
  jwtSecret: <string>process.env.JWT_SECRET,
};
export default secrets;
