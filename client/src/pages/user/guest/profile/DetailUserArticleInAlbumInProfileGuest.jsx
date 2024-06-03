import React from "react";
import { ArticleGuestAPI } from "../../../../apis/user/guest/article/article.api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardArticlesGuest from "../articel/CardDetailGuest";
const DetailUserArticleInAlbumInProfileGuest = () => {
  const [detailArticle, setDetailArticle] = useState([]);
  const { idArticle } = useParams();
  useEffect(() => {
    const fetchDetailArticles = async () => {
      const response = await ArticleGuestAPI.detailArticle(idArticle);
      setDetailArticle(response.data.data);
    };
    fetchDetailArticles();
  }, [idArticle]);

  return (
    <div>
      <CardArticlesGuest data={detailArticle} />
    </div>
  );
};

export default DetailUserArticleInAlbumInProfileGuest;
