import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppConfig } from "./AppConfig";
import { Suspense } from "react";
// import GlobalLoading from './components/loading/Loading';
import NotFound from "./pages/404";
import NotAuthorized from "./pages/401";
import AuthGuard from "./guard/AuthGuard";
import DashboardPR from "./layout/pr/DashboardPR";
import PRArticle from "./pages/pr/articles/PRArticles"
import DashboardCensor from "./layout/censor/DashboardCensor";
import Index from "./pages/censor/category";
import DashboardAuthUser from "./layout/user/auth/DashboardAuthUser";
import PrChart from "./pages/pr/chart/PrChart";
import Dashboard from "./pages/censor/dashboard/Dashboard";
import DanhSachActicles from "./pages/censor/articles/ListArticle";
import Texteditor from "./pages/user/create-article/texteditor";
import DashboardGuestUser from "./layout/user/guest/DashboardGuestUser";
import HomeGuestUser from "./pages/user/guest/Home";
import GusetGuard from "./guard/GuestGuard";
import ArticelGuestUser from "./pages/user/guest/articel/ArticelGuestUser";
import ListArticel from "./pages/user/auth/article/ListArticel";
import MyArticle from "./pages/user/my-article/MyArticle";
import MyFavouriteArticle from "./pages/user/my-favourite/MyFavouriteArticle";
import ProfileUser from "./pages/user/profile/ProfileUser";
import History from "./pages/user/history/history";
import Album from "./pages/user/album/Album";
import DetailAlbum from "./pages/user/album/DetailAlbum";
import DetailUserArticle from "./pages/user/auth/article/DetailUserArticle";
import DetaiConsorArticle from "./pages/censor/articles/DetailCenSorArticle";
import DetailMyArticle from "./pages/user/my-article/DetailMyArticle";
import RegistrationPeriod from "./pages/censor/registration-period/registration-period";
import DetailRegistration from "./pages/censor/registration-period/user-registration-period/DetailRegistration";
import DownloadArticle from "./pages/censor/download/download-article";
import GlobalLoading from "./components/global-loading/GlobalLoading";
import DetailArticleGuest from "./pages/user/guest/articel/DetailArticleGuest";
import ApprovedHistory from "./pages/censor/history/History";
import DetaiConsorApprovedArticle from "./pages/censor/history/DetailCenSorApprovedArticle";
import FormSend from "./pages/censor/form-send/formSend";
import DetailArticle from "./pages/censor/articles/DetailArticle";
import Teacher from "./pages/censor/teacher/teacher";
import TeacherRegistration from "./pages/censor/teacher/ModalAdd";
import FullTextSearch from "./pages/user/full-text-search/FullTextSearch";
import DetailTeacher from "./pages/censor/teacher/ModalDetail";
import AddRegistrationPeriod from "./pages/censor/registration-period/add/AddRegistrationPeriod";
import FullTextSearchUser from "./pages/user/full-text-search/FullTextSearchUser";
import FullTextSearchArticle from "./pages/user/full-text-search/FullTextSearchArticle";
import DetailUserArticleInProfile from "./pages/user/profile/DetailUserArticle";
import DetailUserAlbumInProfile from "./pages/user/profile/DetailUserAlbum";
import DetailUserArticleInAlbumInProfile from "./pages/user/profile/DetailUserArticle copy";
import DashboardCensorUi from "./pages/censor/chart/Dashboard";
import { FloatButton } from "antd";
import { useAppSelector } from "./app/hooks";
import { SelectLoading } from "./app/reducers/loading/loading.reducer";
import Login from "./pages/login/Login";
import AuthorSwitch from "./pages/login/AuthorSwitch";
import NotAuthen from "./pages/403";
import Ooops from "./pages/oops";
import ProfileUserForGuest from "./pages/user/guest/profile/ProfileUserForGuest";
import DetailUserAlbumGuest from "./pages/user/guest/profile/DetailUserAlbumGuest";
import DetailUserArticleInAlbumInProfileGuest from "./pages/user/guest/profile/DetailUserArticleInAlbumInProfileGuest";
import ArticleFirst from "./pages/user/guest/ArticleFirst";
import PrDetailArticle from "./pages/pr/articles/PrDetailArticle";
function App() {
  const data = useAppSelector(SelectLoading);

  return (
    <div className="App scroll-smooth md:scroll-auto font-sans">
      {data && <GlobalLoading />}

      <BrowserRouter basename={AppConfig.routerBase}>
        <Suspense fallback={<GlobalLoading />}>
          <Routes>
            <Route
              path="*"
              element={<NotFound />}
            />
            <Route
              path="/402"
              element={<NotAuthen />}
            />
            <Route
              path="/400"
              element={<NotAuthorized />}
            />
            <Route
              path="/ooops"
              element={<Ooops />}
            />
            <Route
              path="/layout-guard-roles"
              element={<NotAuthorized />}
            />
            <Route
              path="/"
              element={
                <Navigate
                  replace
                  to="/home"
                />
              }
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/author-switch"
              element={<AuthorSwitch></AuthorSwitch>}
            />
            {/* Màn censor */}
            <Route
              path="/censor/category"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <Index />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/dashboard"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <Dashboard />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/article"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <DanhSachActicles />
                  </DashboardCensor>
                 // </AuthGuard>
              }
            />
            <Route
              path="/censor/article/:id"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <DetaiConsorArticle />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/detail-article/:id"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <DetailArticle />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/registration-period"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <RegistrationPeriod />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/registration-period/add"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <AddRegistrationPeriod />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/cloud-article"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <DownloadArticle />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            {/* <Route
              path="/censor/cloud-article/send-article/:id"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <SendArticle />
                  </DashboardCensor>
                // </AuthGuard>
              }
            /> */}
            <Route
              path="/censor/registration-period/:id"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <DetailRegistration></DetailRegistration>
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/approved-history"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <ApprovedHistory />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/approved-history/:id"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <DetaiConsorApprovedArticle />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/form-send"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <FormSend />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/teacher"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <Teacher />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/teacher/:id"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <DetailTeacher />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/teacher/registration"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <TeacherRegistration />
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            <Route
              path="/censor/chart"
              element={
                // <AuthGuard>
                  <DashboardCensor>
                    <DashboardCensorUi></DashboardCensorUi>
                  </DashboardCensor>
                // </AuthGuard>
              }
            />
            {/* Màn user */}
            <Route
              path="/user/create-article"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <Texteditor />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/article"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <ListArticel />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/my-article/update/:id"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <Texteditor />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/all/search"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <FullTextSearch />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/peopel/search"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <FullTextSearchUser />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/posts/search"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <FullTextSearchArticle />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/my-article"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <MyArticle />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/my-favourite-article"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <MyFavouriteArticle />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/profile/:id"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <ProfileUser />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/profile/:id/article/:id"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <DetailUserArticleInProfile />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/profile/:idUser/album/:idAlbum"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <DetailUserAlbumInProfile />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/profile/:idUser/album/:idAlbum/article/:idArticle"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <DetailUserArticleInAlbumInProfile />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/article/:id"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <DetailUserArticle />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/my-article/:id"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <DetailMyArticle />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/history"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <History />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/album"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <Album />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            <Route
              path="/user/album/:id"
              element={
                // <AuthGuard>
                  <DashboardAuthUser>
                    <DetailAlbum />
                  </DashboardAuthUser>
                // </AuthGuard>
              }
            />
            {/* Màn reviewer */}
            {/* <Route
              path="/reviewer/article"
              element={
                // <AuthGuard>
                  <DashBoardReviewer>
                    <Reviewer />
                  </DashBoardReviewer>
                // </AuthGuard>
              }
            />
            <Route
              path="/reviewer/article/:id"
              element={
                // <AuthGuard>
                  <DashBoardReviewer>
                    <DetailPage />
                  </DashBoardReviewer>
                // </AuthGuard>
              }
            /> */}
            {/* Người dùng chưa đăng nhập */}

            <Route
              path="/home"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <HomeGuestUser />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />
            <Route
              path="/article/sample-article"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <ArticleFirst />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />
            <Route
              path="/blog"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <HomeGuestUser />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />
            <Route
              path="/article"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <ArticelGuestUser />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <ProfileUserForGuest />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />
            <Route
              path="/article/:id"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <DetailArticleGuest />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />
            <Route
              path="/profile/:idUser/album/:idAlbum"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <DetailUserAlbumGuest />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />
            <Route
              path="/profile/:idUser/album/:idAlbum/article/:idArticle"
              element={
                <GusetGuard>
                  <DashboardGuestUser>
                    <DetailUserArticleInAlbumInProfileGuest />
                  </DashboardGuestUser>
                </GusetGuard>
              }
            />

              {/* Màn pr */}
              <Route
                  path="/pr/article"
                  element={
                      // <AuthGuard>
                          <DashboardPR>
                              <PRArticle />
                          </DashboardPR>
                      // </AuthGuard>
                  }
              />
              <Route
                  path="/pr/article/:id"
                  element={
                      // <AuthGuard>
                          <DashboardPR>
                              <PrDetailArticle />
                          </DashboardPR>
                      // </AuthGuard>
                  }
              />
              <Route
                  path="/pr/chart"
                  element={
                      // <AuthGuard>
                          <DashboardPR>
                              <PrChart />
                          </DashboardPR>
                      // </AuthGuard>
                  }
              />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <FloatButton.BackTop />
    </div>
  );
}

export default App;
