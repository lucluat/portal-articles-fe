import { request } from "../../../../helper/request.helper";

export class FullSearchTextAPI {
  static COMPONENT_NAME = "user/full-text-search";

  static getSearchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/search-all`,
      params: filter,
    });
  };

  static getUserSearch = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/search-user`,
      params: filter,
    });
  };

  static getArticleSearch = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/search-article`,
      params: filter,
    });
  };
}
