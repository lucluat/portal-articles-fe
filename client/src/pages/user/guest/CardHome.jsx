import { Card, Image } from "antd";
import React from "react";
import { Link } from "react-router-dom";
// import Link from "antd/es/typography/Link";
const { Meta } = Card;
const CardHome = (props) => {
  const { image, title, subTitle, idBaiViet, category } = props;

  return (
    <>
      <Card
        className="mt-5 bg-transparent"
        style={{
          width: "100%",
          border: 0,
          borderRadius: 0,
        }}
        cover={
          <Image
            style={{
              height: "200px",
              objectFit: "cover",
            }}
            alt="example"
            src={image}
          />
        }
      >
        <Meta
          style={{ marginLeft: "-28px" }}
          title={
            <>
              <span>{category.name}</span>
              {/* </Link> */}
              <Link
                href={`/article/${idBaiViet}`}
                style={{ color: "gray", fontWeight: 500 }}
              >
                <h4 className="mt-3">{title}</h4>
              </Link>
            </>
          }
          description={
            <>
              <div className="flex items-center">
                <p
                  className="w-3/5"
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {subTitle} ...
                </p>
                <Link className="w-2/5" to={`/article/${idBaiViet}`}>
                  Xem thêm
                </Link>
              </div>
            </>
          }
        />
      </Card>
    </>
  );
};
export default CardHome;
