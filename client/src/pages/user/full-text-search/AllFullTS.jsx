import { Button } from "antd";
import React from "react";
import ResultUser from "./ResultUser";
import CardDemo from "../card/ViewCard";
import { Link } from "react-router-dom";

const AllFullTS = (props) => {
  const { user, articles, search } = props

  return (
    <div>
      {user.length !== 0 &&
        <div className="mt-5 mb-12">
          <span style={{marginBottom: "40px"}}
                className="fancy justify-center items-center flex text-center">
        <hr className="w-full bg-gray-200 border-0" />
                 <span
                  className="text w-full"
                  style={{
                    color: "gray",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  Mọi người
                </span>
                <hr className="w-full bg-gray-200 border-0" />
      </span>
          <ResultUser data={user}></ResultUser>
          <Link to={`/user/peopel/search?search=${search}`}
          ><Button
            type="primary"
            block
            className=" mt-3"
            style={{ fontSize: "15px", backgroundColor: "#2e2e2e" }}>
              Xem tất cả
            </Button></Link>
        </div>
      }
      {articles.length !== 0 && <div>
        
      <span style={{marginBottom: "40px"}}
                className="fancy justify-center items-center flex text-center">
        <hr className="w-full bg-gray-200 border-0" />
                 <span
                  className="text w-full"
                  style={{
                    color: "gray",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  DANH SÁCH BÀI VIẾT TÌM KIẾM
                </span>
                <hr className="w-full bg-gray-200 border-0" />
      </span>
                
        <CardDemo data={articles}></CardDemo>
        <Link to={`/user/posts/search?search=${search}`}
          ><Button
            type="primary"
            block
            className=" mt-3"
            style={{ fontSize: "15px", backgroundColor: "#2e2e2e", marginTop: "-30px" }}>
            Xem tất cả
          </Button></Link>
      </div>}
      
    </div>
  );
};

export default AllFullTS;
