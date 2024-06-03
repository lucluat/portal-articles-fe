import { request } from "../../../helper/request.helper";

export class PrAPI {
    static COMPONENT_NAME = "pr/article";

    static fetchAll = (filter) => {
        return request({
            method: "GET",
            url: `/${this.COMPONENT_NAME}`,
            params: filter,
        });
    };

    static putStar = (id) => {
        return request({
            method: "PUT",
            url: `/${this.COMPONENT_NAME}/star/${id}`,
        })
    }

    static getAllCategory = () => {
        return request({
            method: "GET",
            url: `/pr/category`
        })
    }

};
