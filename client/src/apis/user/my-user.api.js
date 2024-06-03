import { request } from "../../helper/request.helper";

export class UserAPI {
  static COMPONENT_NAME = "user";

  static findByUserId = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/my-user-detail`,
    });
  };
  static findById = (id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/detail/${id}`,
    });
  };
  static updateStory = (data) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update/story`,
      data: data,
    });
  };

  static updateBackground = (data) => {
    const formData = new FormData();
    formData.append("file", data.background);

    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update/background`,
      data: formData,
    });
  };
  static updateAvatar = (data) => {

    const formData = new FormData();
    formData.append("file", data.avatar[0]);

    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update/avatar`,
      data: formData,
    });
  };
}
