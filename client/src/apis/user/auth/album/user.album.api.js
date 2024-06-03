import { request } from "../../../../helper/request.helper";

export class AuthAlbumAPI {
  static COMPONENT_NAME = "user/album";

  static fetchAllAlbum = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
    });
  };

  static fetchAllArticleByAlbum = (id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/detail-article-by-album?albumId=${id}`,
    });
  };
  static fetchAllArticleByAlbumInProfile = (data) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/detail-article-by-album-in-profile?albumId=${data.albumId}&userId=${data.userId}`,
    });
  };
  static fetchAlbumById = (id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/detail/${id}`,
    });
  };

  static deleteArticleOnAlbum = (articleId, albumId) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/delete-all-article?articleId=${articleId}&albumId=${albumId}`,
    });
  };

  static addAlbum = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/create`,
      data: data,
    });
  };

  static deleteAlbum = (id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/delete/${id}`,
    });
  };
  
  static fetchAlbumByIdUser = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/getAlbumInProfile`,
      params: filter,
    });
  };

  static updateAlbum = (data, id) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update/${id}`,
      data: data,
    });
  };
}
