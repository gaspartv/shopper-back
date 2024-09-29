import { HttpStatus } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Exception } from "../../utils/http-exception";
import { MeasureTypeEnum } from "./enums/measure-type.enum";

interface MeasureSetDto {
  measure_uuid?: string;
  measure_datetime?: Date;
  measure_type?: string;
  has_confirmed?: boolean;
  image_url?: string;
  measure_value?: number;
  customer_code?: string;
}

interface MeasureCreateDto {
  measure_datetime: Date;
  measure_type: MeasureTypeEnum;
  image_url: string;
  measure_value: number;
  customer_code: string;
}

export class Measure {
  private measure_uuid?: string;
  private measure_datetime?: Date;
  private measure_type?: string;
  private has_confirmed?: boolean;
  private image_url?: string;
  private measure_value?: number;
  private customer_code?: string;

  constructor(dto?: MeasureSetDto) {
    this.measure_uuid = dto?.measure_uuid;
    this.measure_datetime = dto?.measure_datetime;
    this.measure_type = dto?.measure_type;
    this.has_confirmed = dto?.has_confirmed;
    this.image_url = dto?.image_url;
    this.measure_value = dto?.measure_value;
    this.customer_code = dto?.customer_code;
  }

  get() {
    return {
      measure_uuid: this.measure_uuid,
      measure_datetime: this.measure_datetime,
      measure_type: this.measure_type,
      has_confirmed: this.has_confirmed,
      image_url: this.image_url,
      measure_value: this.measure_value,
      customer_code: this.customer_code,
    };
  }

  get id() {
    return this.measure_uuid;
  }

  setMeasureDatetime(measure_datetime: Date) {
    measure_datetime =
      measure_datetime instanceof Date
        ? measure_datetime
        : new Date(measure_datetime);
    if (measure_datetime instanceof Date) {
      this.measure_datetime = measure_datetime;
      return;
    }
    Exception.execute(
      "Invalid measure_datetime",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  setMeasureType(measure_type: MeasureTypeEnum) {
    if (Object.values(MeasureTypeEnum).includes(measure_type)) {
      switch (measure_type) {
        case MeasureTypeEnum.GAS:
          this.measure_type = MeasureTypeEnum.GAS;
          break;
        case MeasureTypeEnum.WATER:
          this.measure_type = MeasureTypeEnum.WATER;
          break;
        default:
          Exception.execute(
            "The measurement type must be 'WATER' or 'GAS'",
            "INVALID_DATA",
            HttpStatus.BAD_REQUEST,
          );
      }
      return;
    }
    Exception.execute(
      "The measurement type must be 'WATER' or 'GAS'",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  setImageUrl(image_url: string) {
    if (image_url) {
      const regex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|svg|webp|ico)$/;
      if (regex.test(image_url)) {
        this.image_url = image_url;
        return;
      }
    }
    Exception.execute(
      "Invalid image_url",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  setMeasureValue(measure_value: number) {
    if (typeof measure_value === "number") {
      this.measure_value = measure_value;
      return;
    }
    Exception.execute(
      "Invalid measure_value",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  setCustomerCode(customer_code: string) {
    if (typeof customer_code === "string") {
      this.customer_code = customer_code;
      return;
    }
    Exception.execute(
      "Invalid customer_code",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  setHasConfirmed(has_confirmed: boolean) {
    if (typeof has_confirmed === "boolean") {
      this.has_confirmed = has_confirmed;
      return;
    }
    Exception.execute(
      "Invalid has_confirmed",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  create(dto: MeasureCreateDto) {
    this.measure_uuid = randomUUID();
    this.setMeasureDatetime(dto.measure_datetime);
    this.setMeasureType(dto.measure_type);
    this.setImageUrl(dto.image_url);
    this.setMeasureValue(dto.measure_value);
    this.setCustomerCode(dto.customer_code);
  }
}
