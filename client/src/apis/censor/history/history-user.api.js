import { request } from "../../../helper/request.helper";


export class CensorHistoryAPI {
  static COMPONENT_NAME = "censor/article/history";

  static fetchAllHistory = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
    });
  };

  static findTimelineArticleHistory = (data) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/timeline`,
      params: data,
    });
  };
}
