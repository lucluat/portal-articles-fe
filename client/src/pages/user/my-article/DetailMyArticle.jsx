import React from "react";
import { MyArticleAPI } from "../../../apis/user/auth/article/my-article.api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardDetailMyArticles from "./CardDetailMyArticle";
import { Empty, notification } from "antd";

const DetailMyArticle = () => {
  const [detailMyArticle, setDetailMyArticle] = useState();
  const [mess, setMess] = useState("");
  const { id } = useParams();
  useEffect(() => {
    const fetchDetailArticles = async () => {
        MyArticleAPI.detailMyArticle(id).then((response) => {
          setDetailMyArticle(response.data.data);
        }).catch((error) => {
          setMess(error.response.data.message)
          notification.error({
            message: "Lỗi",
            description: error.response.data.message,
            placement: "bottom-right"
          });
        });
    };
    fetchDetailArticles();
  }, [id]);

  return (
    <div>
      {detailMyArticle ? (<CardDetailMyArticles data={detailMyArticle} />) : (<Empty description={mess}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "0",
                  right: "0",
                  zIndex: "0",
                }}/>)}
    </div>
  );
};

export default DetailMyArticle;
