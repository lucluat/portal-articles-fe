import { request } from "../../../../helper/request.helper";


export class UserHistoryAPI {
  static COMPONENT_NAME = "user/history";

  static fetchAllHistory = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter
    });
  };

  static deleteHistory = (id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/delete/${id}`,
    });
  };
}
