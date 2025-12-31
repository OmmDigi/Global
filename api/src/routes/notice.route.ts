import { Router } from "express";
import { deleteNotice, getNoticeList, sendNotice } from "../controllers/notice.controller";

export const noticeRoute = Router();

noticeRoute.post("/", sendNotice).get("/", getNoticeList).delete("/:id", deleteNotice)
