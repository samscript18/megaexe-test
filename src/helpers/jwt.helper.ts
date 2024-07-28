import secrets from "../constants/secrets.const";
import { sign, verify } from "jsonwebtoken";

class JWT {
  private decode(): string {
    return Buffer.from(secrets.jwtSecret).toString("ascii");
  }

  public async generateToken(userId?: string): Promise<string> {
    const token = await sign({ userId }, this.decode(), { expiresIn: "1d" });
    return token;
  }

  public async verifyToken<T = { userId: string }>(token: string): Promise<T> {
    const payload = await verify(token, this.decode());
    return payload as T;
  }
}
const jwtHelper = new JWT();
export default jwtHelper;
