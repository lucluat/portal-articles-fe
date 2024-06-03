import { request } from "../../helper/request.helper";

export class AccountAPI {
  static COMPONENT_NAME = "guest-guard/account";

  static checkAccount = (data) => {
    console.log(data);
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/login`,
      data: data,
    });
  };
}
