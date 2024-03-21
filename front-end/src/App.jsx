import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Contatti from "./pages/Contatti";
import PhotosShow from "./pages/photos/Show";
import DefaultLayout from "./pages/DefaultLayout";
import { createContext, useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import SuperAdminTab from "./pages/SuperAdminTab";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePhoto from "./pages/CreateNewPhoto";
import UpdatePhoto from "./pages/UpdatePhoto";
import ShowOwnPhoto from "./pages/ShowOwnPhoto";
import PrivateRoutes from "./middlewares/PrivateRoutes";
import RoleAccess from "./middlewares/RoleAccess";
import GuestRoutes from "./middlewares/GuestRoutes";
import NotFound from "./pages/NotFound";
import GenericError from "./pages/GenericError";

// creiamo un context globale e lo esporto per poterlo usare in altri componenti
export const GlobalContext = createContext();

function App() {
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  return (
    <GlobalContext.Provider
      value={{ counter, setCounter, loading, setLoading, theme, setTheme }}
    >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              element={<DefaultLayout />}
              errorElement={<GenericError></GenericError>}
            >
              <Route
                path="/"
                element={<Home />}
                errorElement={<GenericError></GenericError>}
              ></Route>
              <Route path="/menu" element={<Menu />}></Route>
              <Route path="/contatti" element={<Contatti />}></Route>
              <Route path="/photos/:id" element={<PhotosShow />}></Route>
              <Route path="show-posts" element={<ShowOwnPhoto />}></Route>
              <Route
                path="/login"
                element={
                  <GuestRoutes>
                    <Login />
                  </GuestRoutes>
                }
              ></Route>
              <Route
                path="/register"
                element={
                  <GuestRoutes>
                    <Register />
                  </GuestRoutes>
                }
              ></Route>
            </Route>

            {/* Rotte private */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoutes>
                  <DefaultLayout />
                </PrivateRoutes>
              }
            >
              <Route index element={<Dashboard />}></Route>
              <Route path="user" element={<Dashboard />}></Route>
            </Route>

            <Route
              path="new-post"
              element={
                <PrivateRoutes>
                  <DefaultLayout />
                </PrivateRoutes>
              }
              errorElement={<GenericError></GenericError>}
            >
              <Route index element={<CreatePhoto />}></Route>
              <Route path="user" element={<CreatePhoto />}></Route>
            </Route>
            <Route
              path="update-post/:id"
              element={
                <PrivateRoutes>
                  <DefaultLayout />
                </PrivateRoutes>
              }
              errorElement={<GenericError></GenericError>}
            >
              <Route index element={<UpdatePhoto />}></Route>
              <Route path="user" element={<UpdatePhoto />}></Route>
            </Route>
            <Route
              path="super-admin-tab"
              element={
                <PrivateRoutes>
                  <RoleAccess roles="superadmin">
                    <DefaultLayout />
                  </RoleAccess>
                </PrivateRoutes>
              }
            >
              <Route index element={<SuperAdminTab />}></Route>
              <Route path="user" element={<SuperAdminTab />}></Route>
            </Route>

            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
}

export default App;
