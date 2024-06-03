import jwtDecode from "jwt-decode";
import React from "react";
import {
  deleteToken,
  isTokenValid,
  setAccountUser,
  setRefreshToken,
  setToken,
} from "../../helper/userToken";
import { connectIdentity } from "../../AppConfig";
import { Col, Row, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AccountAPI } from "../../apis/user/accountUser.api";
import { useState } from "react";
// import tearch from '../../assets/images/teacher.jpg';
// import admin from '../../assets/images/admin.jpg';
import users from '../../assets/images/user.jpg';
import noLogin from '../../assets/images//roles-images/Reviewer_NguoiDocBaiViet.jpg';
import teacher from '../../assets/images/roles-images/Teacher_GiangVienVietBai_4.jpg';
import teacherLead from '../../assets/images/roles-images/TeacherLead_ChuNhiemBoMon_4.jpg';
import pr from '../../assets/images/roles-images/LeaderPR_TruongPhongPR.jpg';
import identity from '../../assets/images/roles-images/Identity_4.jpg';

import "./login.css";
const AuthorSwitch = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState([]);
  const urlSearchParams = new URLSearchParams(window.location.search);
  // const tokenValue = urlSearchParams.get("state");
  // console.log({tokenValue});
  // const tokenObj = JSON.parse(tokenValue);
  // const { accessToken, refreshToken } = tokenObj;

  const tokenValue = urlSearchParams.get("state");
  const decodeToken = atob(tokenValue);
  const authenToken = JSON.parse(decodeToken);
  const { accessToken, refreshToken } = authenToken;

  // lấy background cho từng code
  const switchBg = (roleCode) => {
    switch (roleCode) {
      case "ADMIN":
        return teacherLead;
      case "GIAO_VIEN":
        return teacher
      case "REVIEWER":
        return users
      case "PR":
        return pr
      default:
        return;
    }
  }

  // chọn đường dẫn cho từng role
  const swtichRole = (roleCode) => {
    switch (roleCode) {
      case "ADMIN":
        navigate("/censor/article");
        break;
      case "GIAO_VIEN":
        navigate("/user/article");
        break;
      case "PR":
        navigate("/pr/chart");
        break;
      default:
        navigate("/home");
        break;
    }
  };

  // hàm này khởi tạo đối tượng user từ jwt nhận về sau đó call về be của articles để biết người dùng tồn tại chưa và thêm vào hệ thống
  const checkUser = (decodedToken) => {
    var user = { // khời tạo người dùng từ jwt
      id: decodedToken.userId,
      code: decodedToken.userName,
      name: decodedToken.fullName,
      email: decodedToken.email,
      img: decodedToken.picture,
      story: "",
      background: "",
      status: 0,
      role: 1,
    };
    AccountAPI.checkAccount(user).then((response) => { // Call api đến BE Xác thực user có chưa để thêm vào csdl
      setAccountUser(response.data.data.code);
    });
  };

  // hàm này sau khi lấy tất cả role của hệ thống tiến hành loại bỏ các role trùng sau đó set cho useState 
  const removeDuplicateRoles = (list) => {
    const uniqueRoles = [];
    const roleCodes = new Set();

    list.forEach(role => {
      if (!roleCodes.has(role.code)) {
        uniqueRoles.push(role);
        roleCodes.add(role.code);
      }
    });
    setRole(uniqueRoles);
  }

  //hàm này lấy tất cả các role từ token và ném vào nhx hàm chỉ có trong bài viết 
  const getListRolesInToken = () => {
    let listRole = [{
      code:"ADMIN",
      name:"ADMIN",
      background:"ADMIN"
    },{
      code:"GIAO_VIEN",
      name:"GIAO_VIEN",
      background:"GIAO_VIEN"
    },{
      code:"REVIEWER",
      name:"REVIEWER",
      background:"REVIEWER"
    },{
      code:"PR",
      name:"PR",
      background:"PR"
    }]; // khởi tạo 1 list role
    // if (isTokenValid(accessToken)) { // validate Token xem token có hợp lệ không ?
      // setToken(accessToken); // lấy tokens
      // setRefreshToken(refreshToken); // lấy refresh tokens
      // const decodedToken = jwtDecode(accessToken); // giải mã tokens
      //
      // if (!Array.isArray(decodedToken.rolesCode)) { // nếu chỉ trả ra 1 đối tượng thì sẽ vào đây
      //   if (decodedToken.rolesCode === "ADMIN" || decodedToken.rolesCode === "GIAO_VIEN" || decodedToken.rolesCode === "REVIEWER" || decodedToken.rolesCode === "PR") {
      //     listRole.push({
      //       code: decodedToken.rolesCode, // lấy code
      //       name: decodedToken.rolesName, // lấy tên role
      //       background: switchBg(decodedToken.rolesCode),  // switchBG cho từng role
      //     });
      //   }
      // } else { // nếu chỉ trả ra 1 mảng đối tượng thì sẽ vào đây
      //   for (let index = 0; index < decodedToken.rolesCode.length; index++) {
      //     if (decodedToken.rolesCode[index] === "ADMIN" || decodedToken.rolesCode[index] === "GIAO_VIEN" || decodedToken.rolesCode[index] === "REVIEWER" || decodedToken.rolesCode[index] === "PR") {
      //       const roleCode = decodedToken.rolesCode[index]; // lấy theo mảng
      //       const roleName = decodedToken.rolesName[index]; // lấy theo mảng
      //       listRole.push({
      //         code: roleCode, // lấy code
      //         name: roleName, // lấy tên role
      //         background: switchBg(roleCode), // switchBG cho từng role
      //       })
      //     }
      //   }
      // }
      // checkUser(decodedToken); // gọi hàm check user từ token trả ra bắn về BE để check user đã tồn tại kiểm soát user
      removeDuplicateRoles(listRole); // gọi hàm check role nếu iden trả role bị trùng
    // }
    // else {
    //   deleteToken(); // hủy bỏ tokens sau đó quay trở về Identity
    //   window.location.href = connectIdentity;
    // }
  }

  useEffect(() => {
    getListRolesInToken();
  }, []);

  return (
    <div id="auth_switch" className="flex justify-center items-center min-h-screen " style={{ overflow: "hidden", background: '#eda736' }}>
      <Row style={{}}
        gutter={16}
        className="pl-7 pr-7 justify-around items-center cards w-full gap-5 m-5"
      >
        <Tooltip title={"Người xem bài viết"} className=" card" >
          <Col xl={4} lg={12}
            className="form-switch ease-in-out duration-300 rounded-md shadow-xl cursor-pointer"
            style={{ backgroundImage: `url(${noLogin})` }}
            onClick={() => swtichRole("home")} >
          </Col>
        </Tooltip>
        {role.map((el) => ( // map tất cả các role để hiển thị ra card
          <Tooltip title={el.name} className=" card">
            <Col xl={4} lg={12}
              className="form-switch ease-in-out duration-300 rounded-md shadow-xl cursor-pointer"
              style={{ backgroundImage: `url(${el.background})` }}
              onClick={() =>swtichRole(el.code)}>
            </Col>
          </Tooltip>
        ))}
        <Tooltip title={"Quay về identity"}    className=" card" >
          <Col xl={4} lg={12}
            className="form-switch ease-in-out duration-300 rounded-md shadow-xl cursor-pointer"
            style={{ backgroundImage: `url(${identity})` }}
            onClick={() => {
              deleteToken();
              window.location.href = connectIdentity; // quay lại identity
            }} >
          </Col>
        </Tooltip>
      </Row>
    </div>
  );
};

export default AuthorSwitch;
