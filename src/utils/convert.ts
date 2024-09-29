import { HttpException, HttpStatus } from "@nestjs/common";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

export class Convert {
  static async toBase64ImageAndSave(
    image: string,
    customer_code: string,
  ): Promise<{ name: string; filePath: string; mimeType: string }> {
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    const type = matches[1];
    console.log(type);
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");
    const extension = type.split("/")[1];
    const name = `${customer_code}-${Date.now()}.${extension}`;
    const mainDirname = join(__dirname, "..", "..", "tmp");
    const filePath = mainDirname + "/" + name;
    try {
      await mkdir(mainDirname, { recursive: true });
      await writeFile(filePath, buffer);
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
}
