import React from "react";
import { ArticleAPI } from "../../../apis/user/auth/article/article.api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DetailArticles from "../detail-articles/CardDetailArticles";
const DetailUserArticleInAlbumInProfile = () => {
  const [detailArticle, setDetailArticle] = useState([]);
  const { idArticle } = useParams();
  useEffect(() => {
    const fetchDetailArticles = async () => {
      const response = await ArticleAPI.detailArticle(idArticle);
      setDetailArticle(response.data.data);
    };
    fetchDetailArticles();
  }, [idArticle]);

  return (
    <div>
      <DetailArticles data={detailArticle} />
    </div>
  );
};

export default DetailUserArticleInAlbumInProfile;
