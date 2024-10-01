import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { requestSubmitImageMock } from "../module/measures/mocks/request-body-submit-image";
import { Convert } from "./convert";

jest.mock("fs/promises", () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
}));

describe("Convert", () => {
  describe("toBase64ImageAndSave", () => {
    const validBase64Image = requestSubmitImageMock.image;
    const customerCode = "customer123";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should save the image and return the file details", async () => {
      const result = await Convert.toBase64ImageAndSave(
        validBase64Image,
        customerCode,
      );

      const expectedFileName = result.name;
      const expectedFilePath = join(
        __dirname,
        "..",
        "..",
        "tmp",
        expectedFileName,
      );

      expect(mkdir).toHaveBeenCalledWith(join(__dirname, "..", "..", "tmp"), {
        recursive: true,
      });
      expect(writeFile).toHaveBeenCalledWith(
        expectedFilePath,
        expect.any(Buffer),
      );
      expect(result).toEqual({
        name: expectedFileName,
        filePath: expectedFilePath,
        mimeType: "image/png",
      });
    });
  });

  describe("extractImageData", () => {
    it("should extract type and base64 data from a valid image string", () => {
      const result = Convert["extractImageData"](requestSubmitImageMock.image);
      expect(result).toEqual({
        type: "image/png",
        base64Data: expect.any(Buffer),
      });
    });

    it("should throw an error if the image data is invalid", () => {
      expect(() => {
        Convert["extractImageData"]("invalid_data");
      }).toThrow("Invalid image data");
    });
  });

  describe("generateFileName", () => {
    it("should generate a valid file name", () => {
      const customerCode = "customer123";
      const type = "image/png";

      const result = Convert["generateFileName"](customerCode, type);

      expect(result).toMatch(new RegExp(`^${customerCode}-\\d+\\.png$`));
    });
  });
});
