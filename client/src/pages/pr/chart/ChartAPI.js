import { request } from "../../../helper/request.helper";

export const getDataChartByidRegistrationPeriod = (idRegistrationPeriod) => {
  return request({
    method: "GET",
    url: `/pr/chart?idRegistrationPeriod=` + idRegistrationPeriod,
  });
};

export const getAll = () => {
  return request({
    method: "GET",
    url: `/pr/registration-period/all`,
  });
};
