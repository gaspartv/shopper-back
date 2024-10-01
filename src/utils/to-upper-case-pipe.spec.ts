import { BadRequestException } from "@nestjs/common";
import { ToUpperCasePipe } from "./to-upper-case-pipe";

describe("ToUpperCasePipe", () => {
  let pipe: ToUpperCasePipe;

  beforeEach(() => {
    pipe = new ToUpperCasePipe();
  });

  it("should transform a string to upper case", () => {
    const result = pipe.transform("test");
    expect(result).toBe("TEST");
  });

  it("should return undefined if the value is empty", () => {
    const result = pipe.transform("");
    expect(result).toBeUndefined();
  });

  it("should throw a BadRequestException if the value is not a string", () => {
    expect(() => pipe.transform(123 as any)).toThrow(BadRequestException);
    expect(() => pipe.transform({} as any)).toThrow(BadRequestException);
    expect(() => pipe.transform([] as any)).toThrow(BadRequestException);
  });

  it("should handle null values gracefully", () => {
    const result = pipe.transform(null);
    expect(result).toBeUndefined();
  });

  it("should handle undefined values gracefully", () => {
    const result = pipe.transform(undefined);
    expect(result).toBeUndefined();
  });
});
