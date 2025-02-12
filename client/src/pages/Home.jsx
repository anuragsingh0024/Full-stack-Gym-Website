import React from "react";
import NavBar from "../components/common/NavBar";
import gymLogo from "/gym.png";
import Button from "../components/common/Button";
import Membership from "./Membership";
import Trainer from "./Trainer";
import Gallery from "./Gallery";
import AboutUs from "./About";
import Contact from "./Contact";
import Footer from "../components/common/Footer";
import SupplementsPage from "./Suppliments";

const Home = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen mx-auto my-5 items-center">
      <NavBar />

      {/* Main Section */}
      <div className="flex flex-col sm:flex-row justify-center px-5 lg:px-10 w-full lg:w-11/12 my-7">
        {/* Left Section */}
        <div className="flex flex-col gap-10 w-full md:w-1/2">
          <div className="flex flex-col gap-5 mt-10">
            <h1 className="font-inter font-bold text-2xl lg:text-4xl text-textColor leading-[30px] lg:leading-[50px]">
              Welcome to <span className="text-caribbeangreen-400">Anurag</span>{" "}
              Gym, Achieve Your Best Shape with Us
            </h1>
            <p className="text-textColorPara text-sm lg:text-base">
              Welcome to Our Gym, where fitness meets dedication! Whether you're
              a beginner or a pro, we provide top-quality equipment, expert
              trainers, and a motivating environment to help you succeed. Join
              our community and start your journey to a stronger, healthier you
              today!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <Button
              text={"Join us"}
              color={"bg-secondryButton"}
              hover={"hover:bg-caribbeangreen-400"}
              path={"/membership"}
            />
            <Button
              text={"Become a Trainer"}
              color={"bg-button"}
              hover={"hover:bg-buttonHover"}
              path={"/contact"}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full hidden md:block md:w-[50%] ml-32 justify-center mt-10 lg:mt-0">
          <img
            src={gymLogo}
            className="w-[250px] hidden md:block sm:w-[300px] lg:w-[350px]"
            alt="Gym Logo"
          />
        </div>
      </div>

      {/* Membership Component */}
      <Membership />
      {/* Gallery content  */}
      <Gallery />
      {/* Our trainers content  */}
      <Trainer />
      {/* about us content  */}
      <AboutUs />

      {/* contact us content  */}
      <Contact />
      {/* footer content  */}
      <Footer />
    </div>
  );
};

export default Home;
