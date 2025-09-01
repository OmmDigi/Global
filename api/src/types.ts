import { Request } from "express";
import { PaymentDetail } from "pg-sdk-node";

export type IUserCategory = "Admin" | "Teacher" | "Stuff" | "Student";

export interface IUserToken {
  id: number;
  category: IUserCategory;
  permissions?: string;
}

export interface CustomRequest extends Request {
  user_info?: IUserToken;
}

interface PaymentData {
  // merchantId: string;
  orderId: string;
  transactionId: string;
  amount: number;
  state: string;
  responseCode: string;
  paymentInstrument: PaymentDetail[];
}

export interface PaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data: PaymentData;
}

export type TeacherFeeStruct = {
  course_id: number;
  amount: number;
  workshop: number;
  type: string;
  extra: number;
  class_per_month: number
}

export type TEmailData = {
  recipientName: string;
  items: {
    companyName: string;
    name: string;
    renewalDate: string;
    daysRemaining: number;
  }[];
};
