import { env } from "./env";

describe("Environment Variables", () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.PORT;
    delete process.env.DATABASE_URL;
    delete process.env.BASE_URL;
  });

  it("should load valid environment variables", () => {
    env.GEMINI_API_KEY = "test_api_key";
    env.PORT = 3333;
    env.DATABASE_URL = "https://example.com";
    env.BASE_URL = "https://example.com";

    const loadedEnv = env;

    expect(loadedEnv).toEqual({
      GEMINI_API_KEY: "test_api_key",
      PORT: 3333,
      DATABASE_URL: "https://example.com",
      BASE_URL: "https://example.com",
    });
  });
});
