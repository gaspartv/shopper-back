import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    GEMINI_API_KEY: z.string(),

});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error("❌ Invalid environment variables", _env.error.format());

    throw new Error("Invalid environment variables.");
}

const env = _env.data;

export { env };
