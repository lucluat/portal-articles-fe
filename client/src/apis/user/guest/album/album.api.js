import { request } from "../../../../helper/request.helper";

export class AlbumAPI {
  
  static COMPONENT_NAME = "guest-guard/album";

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

  static fetchAlbumByIdUser = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/getAlbumInProfile`,
      params: filter,
    });
  };
}
