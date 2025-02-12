import React, { useEffect, useState } from "react";
import NavBar from "../components/common/NavBar";
import Button from "../components/common/Button";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/common/Loader";

const Trainer = () => {
  const [trainer, setTrainer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrainerApi = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/all-trainers");
      setTrainer(response.data.allTrainer);
      setIsLoading(false);
    } catch (err) {
      console.log("Error while fetching trainer details: ", err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleTrainerApi();
  }, []);

 
  return (
    <div className="w-11/12 justify-center items-center flex flex-col mx-auto my-10 px-10">
      {/* <NavBar /> */}
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <h1 className="font-inter font-bold text-2xl lg:text-4xl text-textColor leading-[30px] lg:leading-[50px]">
          Our <span className="text-caribbeangreen-400">Trainers</span>
        </h1>
        <p className="text-textColorPara mb-5 text-sm lg:text-base w-[90%] text-center">
          At Anurag Gym, our certified trainers are dedicated to helping you
          achieve your fitness goals. With years of experience and personalized
          training approaches, they provide expert guidance, motivation, and
          support every step of the way. Whether you're looking to build
          strength, improve endurance, or lose weight, our trainers are here to
          create a customized plan just for you. Train with the best and unlock
          your full potential!
        </p>
      </div>

      {/* Trainer Cards */}
      {isLoading ? (
        <div>
          {" "}
          <div className="w-full h-screen flex justify-center items-center bg-pure-greys-900">
            <Loader />
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 items-center sm:grid-cols-2 lg:grid-cols-3 gap-10 my-7 w-full">
            {trainer.map((trainer) => {
              return (
                <div
                  key={trainer._id}
                  className="w-full px-11 max-w-sm bg-gradient-to-b border from-gray-400 to-gray-100 text-white rounded-xl shadow-lg transform hover:scale-95 transition-transform duration-300 ease-in-out p-5"
                >
                  {/* Profile Image */}
                  <div className="w-24 h-24 mx-auto mb-4">
                    <img
                      src={trainer.image}
                      alt={`${trainer.name} profile`}
                      className="w-full h-full object-cover rounded-full border-4 border-caribbeangreen-100"
                    />
                  </div>

                  {/* Trainer Info */}
                  <h2 className="text-2xl font-bold text-textColor text-center">
                    {trainer.name}
                  </h2>
                  <p className="text-textColorPara text-sm text-center mt-2">
                    {trainer.speciality}
                  </p>

                  {/* Experience */}
                  <div className="mt-5">
                    <h3 className="text-lg font-semibold text-caribbeangreen-100">
                      Experience
                    </h3>
                    <p className="text-gray-300 mt-1">
                      {trainer.experience} years
                    </p>
                  </div>

                  {/* Button */}
                  <div className="mt-5 text-center">
                    <a target="_blank" href={trainer.profileUrl}>
                      <button className="px-4 rounded-md py-2 bg-caribbeangreen-400 hover:bg-caribbeangreen-600 transition-all duration-300 font-semibold">
                        View Profile
                      </button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainer;
