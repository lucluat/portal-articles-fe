import { request } from "../../../../helper/request.helper";

export class MyArticleAPI {
  static COMPONENT_NAME = "user/my-article";

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };

  static findMyArticleByStatus = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/status`,
      params: filter,
    });
  };

  static createArticleToCensor = (data) => {
        
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("hashtag", data.hashtag);
    formData.append("content", data.content);
    formData.append("descriptive", data.descriptive);
    formData.append("idRegistrationPeriod", data.idRegistrationPeriod);
    if (data.previewImage) {
      formData.append("previewImage", data.previewImage);
    }

    
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/create-article`,
      data: formData,
    });
  };

  static createDraftArticle = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("hashtag", data.hashtag);
    formData.append("content", data.content);
    formData.append("descriptive", data.descriptive);
    formData.append("idRegistrationPeriod", data.idRegistrationPeriod);
    if (data.previewImage) {
      formData.append("previewImage", data.previewImage);
    }

    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/create-draft-article`,
      data: formData,
    });
  };

  static updateDraftArticle = (data, id) => {

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("hashtag", data.hashtag);
    formData.append("content", data.content);
    formData.append("descriptive", data.descriptive);
    formData.append("idRegistrationPeriod", data.idRegistrationPeriod);
    if (data.previewImage) {
      formData.append("previewImage", data.previewImage);
    }

    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update-article/${id}`,
      data: formData,
    });
  };

  static updateArticleTCensor = (data, id) => {
        
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("hashtag", data.hashtag);
    formData.append("content", data.content);
    formData.append("descriptive", data.descriptive);
    formData.append("idRegistrationPeriod", data.idRegistrationPeriod);
    if (data.previewImage) {
      formData.append("previewImage", data.previewImage);
    }

    
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update-article-to-censor/${id}`,
      data: formData,
    });
  };

  static detailMyArticle = (id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/detail-update-my-article/${id}`,
    });
  };

  static delete = (id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/delete-article-to-trash/${id}`,
    });
  };

  static getFileHtml = (url) => {
    return request({
      method: "GET",
      url: url,
    });
  };

  static fetchRegistraition = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/find-registration-period`,
    });
  };

  static fetchTopFive = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/get-top-3`,
    });
  };

  static fetchRegistraitionPeriodInfor = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/find-information-user-reg`,
    });
  };

  static fetchNumberArticles = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/find-number-article`,
    });
  };
}
