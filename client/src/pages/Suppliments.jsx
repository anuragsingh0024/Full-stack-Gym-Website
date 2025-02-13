import React, { useEffect, useState } from "react";
import img from "../../assets/gallery1.jpg";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/common/Loader";

const SupplementsPage = () => {
  const [supplements, setSupplimetns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleProductApi = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/all-products");
      //.log(response);
      setIsLoading(false);
      setSupplimetns(response.data.allProducts);
    } catch (err) {
      //.log("error while fetching products: ", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleProductApi();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }
  return (
    <div className="w-11/12 ml-4 md:ml-7 items-center justify-center min-h-screen text-white p-6">
      <h1 className="text-4xl font-bold mt-5 mb-9 text-center text-caribbeangreen-400 ">
        Supplements Store
      </h1>
      <div className="grid w-full  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {supplements?.map((supplement) => (
          <div
            key={supplement.id}
            className="bg-pure-greys-800 flex flex-col justify-between min-h-min  rounded-xl p-4 shadow-lg  transform hover:scale-95 transition duration-300"
          >
            <img
              src={supplement.image}
              alt={supplement.name}
              className="min-h-min object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-yellow-400">
              {supplement.name}
            </h2>
            <p className="text-textColorPara mt-2">{supplement.description}</p>
            <p className="text-caribbeangreen-300 font-bold mt-3">
              Rs. {supplement.price}
            </p>
            <a href={supplement.url} target="_blank">
              <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition">
                Buy Now
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplementsPage;
