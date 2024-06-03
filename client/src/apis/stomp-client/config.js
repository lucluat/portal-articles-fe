import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { AppConfig } from "../../AppConfig";

let stompClient = null;
export const getStompClient = () => stompClient;
export const connectStompClient = () => {
  const socket = new SockJS(
    AppConfig.apiUrl + "/portal-articles-websocket-endpoint"
  );
  stompClient = Stomp.over(socket, {
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  });
  stompClient.activate();
  // stompClient.debug = function () {};
};

export const connectAndReturnStompClient = () => {
  const socket = new SockJS(
    AppConfig.apiUrl + "/portal-articles-websocket-endpoint"
  );
  const stompClientReturn = Stomp.over(socket, {
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  });
  stompClientReturn.activate();
  return stompClientReturn;
  // stompClient.debug = function () {};
};

export const connectNotifyUserSendArticleToAdmin = () => {
  const socket = new SockJS(
    AppConfig.apiUrl + "/portal-articles-websocket-endpoint"
  );
  const stompClientReturn = Stomp.over(socket, {
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  });
  stompClientReturn.activate();
  // stompClientReturn.connect({}, () => {
  //   stompClientReturn.subscribe(
  //     "/portal-articles/create-number-article-censor"
  //   );
  //   stompClientReturn.subscribe(`/portal-articles/create-notification-censor`);
  //   stompClientReturn.subscribe("/portal-articles/get-article");
  // });
  return stompClientReturn;
};

