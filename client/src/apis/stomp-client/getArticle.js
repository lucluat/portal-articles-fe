// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";
// import { AppConfig } from "../../AppConfig";

// let stompClientArticle = null;

// export const connectStompClientArticle = () => {
//   const socket = new SockJS(
//     AppConfig.apiUrl + "/portal-articles-websocket-endpoint"
//   );
//   stompClientArticle = Stomp.over(socket, {
//     heartbeatIncoming: 10000,
//     heartbeatOutgoing: 10000,
//   });
//   stompClientArticle.activate();
//   // stompClientArticle.debug = function () {};
// };

// export const getStompClientArticle = () => stompClientArticle;
