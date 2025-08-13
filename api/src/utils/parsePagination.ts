import { Request } from "express";

export function parsePagination(req: Request) {
  const limit = parseInt(req.query.limit?.toString() ?? "10");
  if (limit === -1) {
    return { LIMIT: 0, OFFSET: 0, TO_STRING: "" };
  }
  const LIMIT = limit;
  const page = parseInt((req.query.page as string) || "1");
  const OFFSET = (page - 1) * LIMIT;
  const TO_STRING = `LIMIT ${LIMIT} OFFSET ${OFFSET}`;
  delete req.query.page;
  return { OFFSET, LIMIT, TO_STRING };
}
