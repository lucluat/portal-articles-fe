import { request } from "../../../../helper/request.helper";

export class ImportArticle {
  static COMPONENT_NAME = "user/convert";

  static importData = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}`,
      data: data,
    });
  };
}
