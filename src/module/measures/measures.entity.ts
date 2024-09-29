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
  private _measure_uuid?: string;
  private _measure_datetime?: Date;
  private _measure_type?: string;
  private _has_confirmed?: boolean;
  private _image_url?: string;
  private _measure_value?: number;
  private _customer_code?: string;

  constructor(dto?: MeasureSetDto) {
    this._measure_uuid = dto?.measure_uuid;
    this._measure_datetime = dto?.measure_datetime;
    this._measure_type = dto?.measure_type;
    this._has_confirmed = dto?.has_confirmed;
    this._image_url = dto?.image_url;
    this._measure_value = dto?.measure_value;
    this._customer_code = dto?.customer_code;
  }

  get toJson() {
    return {
      measure_uuid: this._measure_uuid,
      measure_datetime: this._measure_datetime,
      measure_type: this._measure_type,
      has_confirmed: this._has_confirmed,
      image_url: this._image_url,
      measure_value: this._measure_value,
      customer_code: this._customer_code,
    };
  }

  get id() {
    return this._measure_uuid;
  }

  set measure_datetime(measureDatetime: Date) {
    measureDatetime =
      measureDatetime instanceof Date
        ? measureDatetime
        : new Date(measureDatetime);
    if (measureDatetime instanceof Date) {
      this._measure_datetime = measureDatetime;
      return;
    }
    Exception.execute(
      "Invalid measure_datetime",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  set measure_type(measure_type: MeasureTypeEnum) {
    if (Object.values(MeasureTypeEnum).includes(measure_type)) {
      switch (measure_type) {
        case MeasureTypeEnum.GAS:
          this._measure_type = MeasureTypeEnum.GAS;
          break;
        case MeasureTypeEnum.WATER:
          this._measure_type = MeasureTypeEnum.WATER;
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

  set image_url(image_url: string) {
    if (image_url) {
      const regex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|svg|webp|ico)$/;
      if (regex.test(image_url)) {
        this._image_url = image_url;
        return;
      }
    }
    Exception.execute(
      "Invalid image_url",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  set measure_value(measure_value: number) {
    if (typeof measure_value === "number") {
      this._measure_value = measure_value;
      return;
    }
    Exception.execute(
      "Invalid measure_value",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  set customer_code(customer_code: string) {
    if (typeof customer_code === "string") {
      this._customer_code = customer_code;
      return;
    }
    Exception.execute(
      "Invalid customer_code",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  set has_confirmed(has_confirmed: boolean) {
    if (typeof has_confirmed === "boolean") {
      this._has_confirmed = has_confirmed;
      return;
    }
    Exception.execute(
      "Invalid has_confirmed",
      "INVALID_DATA",
      HttpStatus.BAD_REQUEST,
    );
  }

  set create(dto: MeasureCreateDto) {
    this._measure_uuid = randomUUID();
    this.measure_datetime = dto.measure_datetime;
    this.measure_type = dto.measure_type;
    this.image_url = dto.image_url;
    this.measure_value = dto.measure_value;
    this.customer_code = dto.customer_code;
  }
}
