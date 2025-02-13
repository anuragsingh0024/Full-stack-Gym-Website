import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/payments", {
        withCredentials: true,
      });
      setTransactions(response.data.allPayments);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      //.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDeleteTransaction = async (id) => {
    try {
      setIsDeleting(true);
      var loadingToast = toast.loading("Deleting Transaction...");
      await axiosInstance.delete(`/admin/delete-transaction/${id}`);
      toast.dismiss(loadingToast);
      toast.success("Transaction deleted successfully");
      fetchTransactions();
      setIsDeleting(false);
    } catch (err) {
      //.log("Error while deleting transaction: ", err);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete this transaction");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }

  return transactions.length > 0 ? (
    <div className="flex flex-col gap-5 w-full items-center p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl border-b border-white w-full text-center pb-5 font-semibold text-caribbeangreen-400">
        Payments
      </h1>
      <div className="w-full overflow-x-auto">
        <div className="w-full px-2 sm:px-4 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 font-bold text-yellow-200 w-full text-left gap-2 sm:gap-4">
            <h1>Email</h1>
            <h1>Plan</h1>
            <h1>Amount</h1>
            <h1 className="hidden md:block">Status</h1>
            <h1 className="hidden md:block">Delete</h1>
          </div>
          {transactions.map((payment) => (
            <div
              key={payment._id}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 font-bold text-white w-full border-t border-gray-500 mt-2 pt-2 gap-2 sm:gap-4"
            >
              <h1>{payment?.userId?.email.replace(/(?<=@).*/, "...")}</h1>
              <h1>{payment.membershipId.type}</h1>
              <h1>Rs. {payment.amount}</h1>
              <h1
                className={`hidden md:block ${
                  payment.status === "success"
                    ? "text-caribbeangreen-400"
                    : "text-textColor"
                }`}
              >
                {payment.status}
              </h1>
              <button
                disabled={isDeleting}
                onClick={() => handleDeleteTransaction(payment._id)}
                className="w-full md:w-20 py-2 bg-brown-500 rounded-md font-semibold hover:bg-brown-700 transition-all duration-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl border-b border-white w-full text-center pb-5 font-semibold text-caribbeangreen-200">
        Payments
      </h1>
      <div className="flex w-full mt-11 justify-center items-center">
        <h1 className="font-bold text-xl text-brown-300 text-center">
          No Transactions found
        </h1>
      </div>
    </div>
  );
};

export default TransactionsTable;
