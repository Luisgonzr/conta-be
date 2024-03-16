import { From } from "./from.interface";

export const FROM: From = {
  email: process.env.SENDGRID_FROM_EMAIL,
  name: process.env.SENDGRID_FROM_NAME,
};
