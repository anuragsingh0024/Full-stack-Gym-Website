import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Loader from "../common/Loader";
import axiosInstance from "../../utils/axiosInstance";

const Dashboard = () => {
  const [user, setUser] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState([]);
  const [products, setProducts] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const handleUserApi = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        "/admin/all-users"
      );

      console.log(response.data.allUsers);
      setUser(response.data.allUsers);
      setIsLoading(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Internal server error";
      toast.error(errorMsg);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionApi = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        "/admin/payments"
      );

      console.log(response.data.allPayments);
      setTransactions(response.data.allPayments);
      setIsLoading(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Internal server error";
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }
  };

  const handleContact = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/contact/allContact", {
        withCredentials: true,
      });
      setContact(response.data.allContact);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching contact inquiries:", error);
    }
  };

  const handleProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/all-products", {
        withCredentials: true,
      });
      setProducts(response.data.allProducts);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching contact inquiries:", error);
    }
  };

  const handleTrainerApi = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/all-trainers", {
        withCredentials: true,
      });
      setTrainers(response.data.allTrainer);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching contact inquiries:", error);
    }
  };

  const activeMemberships = user.filter((item) => {
    return item.membershipStatus === "active";
  });

  const basicMemberships = user.filter(
    (item) => item.memberships?.type === "Basic"
  );
  const standardMemberships = user.filter(
    (item) => item.memberships?.type === "Standard"
  );
  const premiumMemberships = user.filter(
    (item) => item.memberships?.type === "Premium"
  );

  useEffect(() => {
    handleUserApi();
    handleTransactionApi();
    handleContact();
    handleProduct();
    handleTrainerApi();
  }, []);

  const totalRevinue = transactions.reduce(
    (total, item) => total + item.amount,
    0
  );

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold">Total Users</h2>
        <p className="text-4xl mt-2">{user.length}</p>
      </div>
      <div className="bg-caribbeangreen-400 text-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold">Total Revenue</h2>
        <p className="text-4xl mt-2">₹ {totalRevinue}</p>
      </div>
      <div className="bg-yellow-300 text-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold">Pending Issues</h2>
        <p className="text-4xl mt-2">{contact.length}</p>
      </div>
      <div className="bg-caribbeangreen-800 text-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold">Total Active Memberships</h2>
        <p className="text-4xl mt-2">{activeMemberships.length}</p>
      </div>
      <div className="bg-brown-500 text-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold">Total Basic Active Memberships</h2>
        <p className="text-4xl mt-2">{basicMemberships.length}</p>
      </div>
      <div className="bg-brown-700 text-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold">Total Standard Active Memberships</h2>
        <p className="text-4xl mt-2">{standardMemberships.length}</p>
      </div>
      <div className="bg-caribbeangreen-500 text-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold">Total Premium Active Memberships</h2>
        <p className="text-4xl mt-2">{premiumMemberships.length}</p>
      </div>
      <div className="bg-yellow-500 text-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold">Total Products</h2>
        <p className="text-4xl mt-2">{products.length}</p>
      </div>
      <div className="bg-caribbeangreen-500 text-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold">Total Trainers</h2>
        <p className="text-4xl mt-2">{trainers.length}</p>
      </div>
    </div>
  );
};

export default Dashboard;
