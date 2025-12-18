import { verifyToken } from "../services/jwt";
import { CustomRequest, IUserToken } from "../types";
import { ErrorHandler } from "../utils/ErrorHandler";
import { getAuthToken } from "../utils/getAuthToken";
import asyncErrorHandler from "./asyncErrorHandler";

// need to check the access here
export const isAuthorized = (
  route_id: number | number[],
  view_own_only: boolean = false,
) => {
  return asyncErrorHandler(async (req: CustomRequest, _, next) => {
    // need to check is the isAuthenticated middleware called before the isAuthorize or not
    let userInfo: IUserToken | null = null;
    if (req.user_info) {
      userInfo = req.user_info;
    } else {
      const token = getAuthToken(req);
      if (!token) throw new ErrorHandler(401, "Unauthorized");

      const { data, error } = await verifyToken<IUserToken>(token);
      if (error) throw new ErrorHandler(401, "Unauthorized");

      req.user_info = data || undefined;
      userInfo = data;
    }

    if (!userInfo) throw new ErrorHandler(403, "Forbidden error");

    // now check the permission
    const user_permissions_array = JSON.parse(
      userInfo.permissions ?? "[]"
    ) as number[];

    const route_ids = Array.isArray(route_id) ? route_id : [route_id];

    const hasCommon = route_ids.some(item => user_permissions_array.includes(item));

    if (!hasCommon) {
      const currentRequestId =
        req.params?.id ?? req.query?.user_id ?? req.body?.user_id;
      if (view_own_only === true && parseInt(currentRequestId) == userInfo.id) {
        next();
        return;
      }
      throw new ErrorHandler(403, "Forbidden error");
    }

    // if authorize call the next
    next();
  });
};
