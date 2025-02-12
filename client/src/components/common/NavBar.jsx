import React, { useEffect, useState } from "react";
import navItems from "../../data/Nav";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { logOut } from "../../redux/slices/AuthSlice";
import axiosInstance from "../../utils/axiosInstance";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;
  const accountType = JSON.parse(localStorage.getItem("role"));

  // useEffect(()=> {
  //       setIsLoggedIn(!!token);
  // },[])
  console.log("token: ", token);
  console.log("isloggedin", isLoggedIn);

  const handleLogOut = async () => {
    try {
      const { data } = await axiosInstance.delete("/auth/logout");
      toast.success(data.message);
      dispatch(logOut());
      navigate("/");
    } catch (err) {
      console.log("error while logout: ", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-11/12 px-2 mx-auto">
      <nav className="flex flex-row justify-between items-center py-4">
        {/* Logo */}
        <div>
          <h1 className="text-3xl font-bold text-caribbeangreen-400">
            Anurag Gym
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-row justify-center gap-6">
          {navItems.map((item, index) => {
            return (
              <NavLink
                key={index}
                to={item.path}
                className="text-white hover:text-button transition duration-200 text-[15px] font-semibold font-inter"
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Login/Signup or Dashboard */}
        <div className="hidden lg:flex">
          {isLoggedIn ? (
            <div className="flex gap-3">
              <Button
                path={"/dashboard"}
                color={"bg-secondryButton"}
                hover={"hover:bg-caribbeangreen-400"}
                text={"Dashboard"}
              />
              <button onClick={handleLogOut}>
                <Button
                  color={"bg-button"}
                  hover={"hover:bg-buttonHover"}
                  text={"Log out"}
                />
              </button>

              {accountType === "admin" ? (
                <Button
                  path={"/admin"}
                  text={"Admin"}
                  color={"bg-yellow-400"}
                  hover={"hover:bg-yellow-700"}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                path={"/auth/signup"}
                text={"Register"}
                color={"bg-secondryButton"}
                hover={"hover:bg-caribbeangreen-400"}
              />
              <Button
                path={"/auth/signin"}
                text={"Log in"}
                color={"bg-button"}
                hover={"hover:bg-buttonHover"}
              />
            </div>
          )}
        </div>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="lg:hidden">
          <button
            className="text-white text-2xl focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800 text-white flex flex-col items-start gap-4 px-4 py-6 rounded-md">
          {/* Navigation Links */}
          <div className="flex flex-col gap-4 w-full">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className="text-[17px] font-semibold font-inter"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Login/Signup or Dashboard */}
          <div className="mt-4 w-full">
            {isLoggedIn ? (
              <div className="flex flex-row justify-between">
                <Button
                  path={"/dashboard"}
                  color={"bg-secondryButton"}
                  hover={"hover:bg-caribbeangreen-400"}
                  text={"Dashboard"}
                />
                <button onClick={handleLogOut}>
                  <Button
                    color={"bg-button"}
                    hover={"hover:bg-buttonHover"}
                    text={"Log out"}
                  />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button
                  path={"/auth/signup"}
                  text={"Register"}
                  color={"bg-secondryButton"}
                  hover={"hover:bg-caribbeangreen-400"}
                />
                <Button
                  path={"/auth/signin"}
                  text={"Log in"}
                  color={"bg-button"}
                  hover={"hover:buttonHover"}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
