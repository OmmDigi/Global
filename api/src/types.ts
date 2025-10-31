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


export type TFinalPunch = {
  userId: number;
  inTime: string;
  outTime: string;
  status: string;
  date: string;
};

export type TAdmissionPaymentSummery = {
  form_id : number;
  payment_date : string;
  mode : string;
  bill_no : string;
  amount : string;
  fee_head_id : number;
  month : string;
}

export type TFormFeeHeadAmount = {
  form_id : number;
  fee_head_id : number;
  fee : number;
}

export type TAdmissionReportData = {
  sr_no : number;
  student_name : string;
  batch_name : string;
  course_name : string;
  admission_date : string;
  session_name : string;
  payment_summery : TAdmissionPaymentSummery[];
  form_fee_head_amounts : TFormFeeHeadAmount[];
  total_payment : number;
  final_payment_result : number;
  duration : string;
  max_payment_count : number;
}