import { BadRequestException, PipeTransform } from "@nestjs/common";

export class ToUpperCasePipe implements PipeTransform {
  transform(value: string) {
    if (!value) return;
    if (typeof value !== "string") {
      throw new BadRequestException("Measure type must be a string");
    }
    return value.toUpperCase();
  }
}
