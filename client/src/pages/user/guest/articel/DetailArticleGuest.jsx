import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardArticlesGuest from "./CardDetailGuest";
import { ArticleGuestAPI } from "../../../../apis/user/guest/article/article.api";

const DetailArticleGuest = () => {
  const [detailArticle, setDetailArticle] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchDetailArticles = async () => {
      const response = await ArticleGuestAPI.detailArticle(id);
      setDetailArticle(response.data.data);
    };
    fetchDetailArticles();
  }, [id]);

  return (
    <div>
      <CardArticlesGuest data={detailArticle} />
    </div>
  );
};

export default DetailArticleGuest;
