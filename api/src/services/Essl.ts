import axios from "axios";

type SetUser = {
  uid: string;
  userid: string;
  name: string;
  password: string;
};

type DeleteUser = {
  uid: string;
};

export class Essl {
  private BASE_URL: null | string = null;

  constructor() {
    const URL = process.env.ESSL_BASE_API;
    if (!URL) throw new Error("Essl Base Api Is Required");
    this.BASE_URL = URL;
  }

  public async setUser(info: SetUser) {
    if (!this.BASE_URL) throw new Error("Essl Base Api Is Required");
    return await axios.post(`${this.BASE_URL}/api/v1/employee`, {
      device_id: "ESSL-001",
      user: info,
    });
  }

  public async deleteUser(info: DeleteUser) {
    if (!this.BASE_URL) throw new Error("Essl Base Api Is Required");
    return await axios.delete(`${this.BASE_URL}/api/v1/employee`, {
      data: {
        device_id: "ESSL-001",
        uid: info.uid,
      },
    });
  }

  public async updateUser(info: SetUser) {
    if (!this.BASE_URL) throw new Error("Essl Base Api Is Required");
    return await axios.put(`${this.BASE_URL}/api/v1/employee`, {
      device_id: "ESSL-001",
      user: info,
    });
  }
}
