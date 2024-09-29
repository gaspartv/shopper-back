import { GoogleGenerativeAI } from "@google/generative-ai";
import { HttpStatus, Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import { env } from "../../configs/env";
import { Exception } from "../../utils/http-exception";

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  async generateContentWithImages(
    filePath: string,
    mimeType: string,
    prompt: string,
  ): Promise<string> {
    const imagePart = this.fileToGenerativePart(filePath, mimeType);
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
      const { response } = await model.generateContent([prompt, imagePart]);
      return response.text();
    } catch (error) {
      Exception.execute(
        "Error on generate text in gemini",
        "INVALID_DATA",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private fileToGenerativePart(path: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }
}
