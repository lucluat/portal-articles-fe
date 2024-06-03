import { request } from "../../../helper/request.helper";

export class ChartAPI {

    static COMPONENT_NAME = "censor/chart";

    static getPrChart = (filter) => {
      return request({
        method: "GET",
        url: `/${this.COMPONENT_NAME}`,
        params: filter
      });
    };

    static getAllUsersAnalytics = (filter) => {
      return request({
        method: "GET",
        url: `/${this.COMPONENT_NAME}/analytics`,
        params: filter
      });
    }

    static getRegistrationAnalytics = (filter) => {
      return request({
        method: "GET",
        url: `/${this.COMPONENT_NAME}/registration-analytics`,
        params: filter
      });
    }

    static getNumberArticleAnalytics = (filter) => {
      return request({
        method: "GET",
        url: `/${this.COMPONENT_NAME}/number-article-analytic`,
        params: filter
      });
    }

    static getNumberArticleByDateAnalytics = (filter) => {
      return request({
        method: "GET",
        url: `/${this.COMPONENT_NAME}/number-article-analytic-by-date`,
        params: filter
      });
    }
}