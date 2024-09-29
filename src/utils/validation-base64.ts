import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isBase64Image",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") {
            return false;
          }
          const base64Regex = /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/;
          return base64Regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must be a valid Base64 encoded image`;
        },
      },
    });
  };
}
