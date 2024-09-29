import { HttpException, HttpStatus } from "@nestjs/common";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

export class Convert {
  static async toBase64ImageAndSave(
    image: string,
    customer_code: string,
  ): Promise<{ name: string; filePath: string; mimeType: string }> {
    const { base64Data, type } = this.extractImageData(image);

    const name = this.generateFileName(customer_code, type);

    const dirName = join(__dirname, "..", "..", "tmp");

    const filePath = dirName + "/" + name;

    try {
      await mkdir(dirName, { recursive: true });
      await writeFile(filePath, base64Data);
      return { name, filePath, mimeType: type };
    } catch (error) {
      throw new HttpException(
        {
          error_code: "INVALID_DATA",
          error_description: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private static generateFileName(customer_code: string, type: string): string {
    const extension = type.split("/")[1];
    return `${customer_code}-${Date.now()}.${extension}`;
  }

  private static extractImageData(image: string): {
    type: string;
    base64Data: Buffer;
  } {
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error("Invalid image data");
    }
    const type = matches[1];
    const base64Data = Buffer.from(matches[2], "base64");
    return { type, base64Data };
  }
}
