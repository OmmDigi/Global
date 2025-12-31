import axios from "axios";
import { IError } from "../config/types";

type SetUser = {
  uid: string;
  userid: string;
  name: string;
  password: string;
};

type DeleteUser = {
  uid: string;
  userid: string;
  name: string;
  password: string;
};

export class Essl {
  private BASE_URL: null | string = null;
  private DEVICE_ID = "ESSL-001";

  constructor() {
    const URL = process.env.ESSL_BASE_API;
    if (!URL) throw new Error("Essl Base Api Is Required");
    this.BASE_URL = URL;
  }

  public async setUser(info: SetUser) {
    if (!this.BASE_URL) throw new Error("Essl Base Api Is Required");
    try {
      await axios.post(`${this.BASE_URL}/api/v1/employee`, {
        device_id: this.DEVICE_ID,
        user: info,
      });
    } catch (error) {
      if (axios.isAxiosError<IError>(error)) {
        if (error.response) {
          // Server responded with an error
          // console.error("Server error:", error.response.data);
          throw new Error(error.response.data.message || "Server error");
        } else if (error.request) {
          // Request made but no response
          // console.error("No response received:", error.request);
          throw new Error("No response received from essl server");
        } else {
          // Something else (setup error, etc.)
          // console.error("Axios config error:", error.message);
          throw new Error(error.message);
        }
      } else {
        // Not an AxiosError
        // console.error("Unexpected error:", error);
        throw error;
      }
    }
  }

  public async deleteUser(info: DeleteUser) {
    if (!this.BASE_URL) throw new Error("Essl Base Api Is Required");
    try {
      await axios.delete(`${this.BASE_URL}/api/v1/employee`, {
        data: {
          device_id: this.DEVICE_ID,
          user: info,
        },
      });
    } catch (error) {
      if (axios.isAxiosError<IError>(error)) {
        if (error.response) {
          // Server responded with an error
          // console.error("Server error:", error.response.data);
          throw new Error(error.response.data.message || "Server error");
        } else if (error.request) {
          // Request made but no response
          // console.error("No response received:", error.request);
          throw new Error("No response received from essl server");
        } else {
          // Something else (setup error, etc.)
          // console.error("Axios config error:", error.message);
          throw new Error(error.message);
        }
      } else {
        // Not an AxiosError
        // console.error("Unexpected error:", error);
        throw error;
      }
    }
  }

  public async updateUser(info: SetUser) {
    if (!this.BASE_URL) throw new Error("Essl Base Api Is Required");
    try {
      await axios.put(`${this.BASE_URL}/api/v1/employee`, {
        device_id: this.DEVICE_ID,
        user: info,
      });
    } catch (error) {
      if (axios.isAxiosError<IError>(error)) {
        if (error.response) {
          // Server responded with an error
          // console.error("Server error:", error.response.data);
          throw new Error(error.response.data.message || "Server error");
        } else if (error.request) {
          // Request made but no response
          // console.error("No response received:", error.request);
          throw new Error("No response received from essl server");
        } else {
          // Something else (setup error, etc.)
          // console.error("Axios config error:", error.message);
          throw new Error(error.message);
        }
      } else {
        // Not an AxiosError
        // console.error("Unexpected error:", error);
        throw error;
      }
    }
  }

  public async syncAttendance() {
    if (!this.BASE_URL) throw new Error("Essl Base Api Is Required");

    try {
      return await axios.post(`${this.BASE_URL}/api/v1/set-attendance`, {
        device_id: this.DEVICE_ID,
      });
    } catch (error) {
      if (axios.isAxiosError<IError>(error)) {
        if (error.response) {
          // Server responded with an error
          // console.error("Server error:", error.response.data);
          throw new Error(error.response.data.message || "Server error");
        } else if (error.request) {
          // Request made but no response
          // console.error("No response received:", error.request);
          throw new Error("No response received from essl device");
        } else {
          // Something else (setup error, etc.)
          // console.error("Axios config error:", error.message);
          throw new Error(error.message);
        }
      } else {
        // Not an AxiosError
        // console.error("Unexpected error:", error);
        throw error;
      }
    }
  }
}
