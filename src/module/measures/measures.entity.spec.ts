import { randomUUID } from "crypto";
import { MeasureTypeEnum } from "./enums/measure-type.enum";
import { Measure } from "./measures.entity";

describe("Measure Entity", () => {
  let measure: Measure;

  beforeEach(() => {
    measure = new Measure();
  });

  it("should create a measure with valid properties", () => {
    const dto = {
      measure_uuid: randomUUID(),
      measure_datetime: new Date(),
      measure_type: MeasureTypeEnum.WATER,
      has_confirmed: true,
      image_url: "http://localhost:3333/image.png",
      measure_value: 100,
      customer_code: "customer1",
    };
    measure = new Measure(dto);

    expect(measure.toJson).toEqual(dto);
  });

  it("should generate a unique UUID on creation", () => {
    const dto = {
      measure_datetime: new Date(),
      measure_type: MeasureTypeEnum.GAS,
      image_url: "http://localhost:3333/image.png",
      measure_value: 200,
      customer_code: "customer2",
    };
    measure.create = dto;

    const toJson = measure.toJson;

    expect(measure.id).toBeDefined();
    expect(measure.id).not.toBeNull();
    expect(toJson.measure_datetime).toEqual(dto.measure_datetime);
    expect(toJson.measure_type).toEqual(dto.measure_type);
    expect(toJson.image_url).toEqual(dto.image_url);
    expect(toJson.measure_value).toEqual(dto.measure_value);
    expect(toJson.customer_code).toEqual(dto.customer_code);
  });

  it("should set measure_datetime correctly", () => {
    const date = new Date();
    measure.measure_datetime = date;
    expect(measure.toJson.measure_datetime).toEqual(date);
    expect(measure.toJson.measure_datetime).toBeInstanceOf(Date);
  });

  it("should set measure_type correctly", () => {
    measure.measure_type = MeasureTypeEnum.GAS;
    expect(measure.toJson.measure_type).toEqual(MeasureTypeEnum.GAS);
    expect(measure.toJson.measure_type).not.toEqual(MeasureTypeEnum.WATER);
  });

  it("should set image_url correctly", () => {
    measure.image_url = "http://localhost:3333/image.jpg";
    expect(measure.toJson.image_url).toEqual("http://localhost:3333/image.jpg");
  });

  it("should set measure_value correctly", () => {
    measure.measure_value = 150;
    expect(measure.toJson.measure_value).toEqual(150);
  });

  it("should set customer_code correctly", () => {
    measure.customer_code = "customer3";
    expect(measure.toJson.customer_code).toEqual("customer3");
  });

  it("should set has_confirmed correctly", () => {
    measure.has_confirmed = true;
    expect(measure.toJson.has_confirmed).toBe(true);
  });
});
