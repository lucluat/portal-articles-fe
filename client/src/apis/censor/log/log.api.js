import { request } from "../../../helper/request.helper";


export class CensorLogApi {
  static COMPONENT_NAME = "guest-guard/demo";

  static fetchLog = (filter, data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/read-log-function/page`,
      params: filter,
      data: data
    });
  };
  
  static fetchLogMain = (filter, data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/read-log-function-main/page`,
      params: filter,
      data: data
    });
  };
}