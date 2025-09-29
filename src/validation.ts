import type { FieldKind } from './App';

export const validateField = (value: any, kind: FieldKind, required?: boolean) => {
  if (required && (!value || value.toString().trim() === "")) {
    return "This field is required";
  }
  if (value && value.toString().trim() !== "") {
    if (kind === "Integer") {
      const num = Number(value);
      if (!Number.isInteger(num) || num < 0) {
        return "Must be a positive whole number";
      }
    }
    if (kind === "Float") {
      const num = Number(value);
      if (isNaN(num) || num < 0) {
        return "Must be a positive number";
      }
    }
    if (kind === "SmallText" && value.toString().length > 100) {
      return "Text must be 100 characters or less";
    }
  }
  return "";
};