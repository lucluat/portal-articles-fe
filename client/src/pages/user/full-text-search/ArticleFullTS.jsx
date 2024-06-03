import React from "react";

import CardDemo from "../card/ViewCard";

const ArticleFullTS = (props) => {
  return (
    <div>
        <CardDemo data={props.articles}></CardDemo>
    </div>
  );
};

export default ArticleFullTS;
