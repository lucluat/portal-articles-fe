import React from "react";
import { ArticleAPI } from "../../../../apis/user/auth/article/article.api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DetailArticles from "../../detail-articles/CardDetailArticles";
import { Empty, notification } from "antd";

const DetailUserArticle = () => {
  const [detailArticle, setDetailArticle] = useState();
  const [mess, setMess] = useState("");
  const { id } = useParams();
  useEffect(() => {
    const fetchDetailArticles = () => {
        ArticleAPI.detailArticle(id).then((response) => {
          setDetailArticle(response.data.data);
        }).catch((error) => {
          setMess(error.response.data.message)
          notification.error({
            message: "Lỗi",
            description: error.response.data.message,
            placement: "bottom-right"
          });
        })
    };
    fetchDetailArticles();
  }, [id]);

  return (
    <div>
      {detailArticle && <DetailArticles data={detailArticle} />}
      {!detailArticle && <Empty description={mess}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "0",
                  right: "0",
                  zIndex: "0",
                }}/>}
      
    </div>
  );
};

export default DetailUserArticle;
