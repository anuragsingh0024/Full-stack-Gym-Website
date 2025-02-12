import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Membership from "./pages/Membership";
import Trainer from "./pages/Trainer";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NavBar from "./components/common/NavBar";
import Footer from "./components/common/Footer";
import AuthForm from "./pages/Auth";
import SignUpForm from "./components/Auth/SignUpForm";
import SignInForm from "./components/Auth/SignInForm";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import OpenRoute from "./components/Auth/OpenRoute";
import ForgotPasswordForm from "./components/Auth/password/ForgotPasswordForm";
import ResetPassword from "./components/Auth/password/ResetPassword";
import AdminPanel from "./pages/Admin";
import AdminRoute from "./components/Auth/AdminRoute";
import SupplementsPage from "./pages/Suppliments";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <div className="w-screen min-h-screen bg-background flex flex-col font-inter text-white ">
        {/* <NetworkStatus /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/membership"
            element={
              <div className="flex flex-col my-5">
                <NavBar />
                <Membership />
                <Footer />
              </div>
            }
          />
          <Route
            path="/trainers"
            element={
              <div className="flex flex-col my-5">
                <NavBar />
                <Trainer />
                <Footer />
              </div>
            }
          />
          <Route
            path="/gallery"
            element={
              <div className="flex flex-col my-5">
                <NavBar />
                <Gallery />
                <Footer />
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div className="flex flex-col my-5">
                <NavBar />
                <About />
                <Footer />
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div className="flex flex-col my-5">
                <NavBar />
                <Contact />
                <Footer />
              </div>
            }
          />
          <Route
            path="/suppliments"
            element={
              <div className="flex flex-col my-5">
                <NavBar />
                <SupplementsPage />
                <Footer />
              </div>
            }
          />

          <Route
            path="/auth/signup"
            element={
              <div className="flex flex-col my-5">
                <NavBar />
                <OpenRoute>
                  <SignUpForm />
                </OpenRoute>
                <Footer />
              </div>
            }
          />

          <Route
            path="/auth/signin"
            element={
              <div className="flex flex-col my-5">
                <NavBar />
                <OpenRoute>
                  <SignInForm />
                </OpenRoute>
                <Footer />
              </div>
            }
          />

          <Route
            path="/dashboard"
            element={
              <div className="flex flex-col my-5">
                <NavBar />
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
                <Footer />
              </div>
            }
          />

          <Route
            path="/auth/forgot-password"
            element={
              <div className="flex flex-col my-5">
                <OpenRoute>
                  <NavBar />
                  <ForgotPasswordForm />
                  <Footer />
                </OpenRoute>
              </div>
            }
          />

          <Route
            path="/auth/reset-password/:token"
            element={
              <div className="flex flex-col my-5">
                <OpenRoute>
                  <NavBar />
                  <ResetPassword />
                  <Footer />
                </OpenRoute>
              </div>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <div className="flex flex-col my-5">
                    <AdminPanel />
                  </div>
                </AdminRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="flex flex-col my-5">
                <NavBar />
                <NotFound />
              </div>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
