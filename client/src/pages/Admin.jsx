import React, { useState } from "react";
import UsersTable from "../components/Admin/UserTable";
import TransactionsTable from "../components/Admin/Transactions";
import ContactUsTable from "../components/Admin/ContactUs";
import Dashboard from "../components/Admin/Dashboard";
import MembershipsTable from "../components/Admin/MembershipsTable";
import Product from "../components/Admin/Product";
import Trainer from "../components/Admin/Trainer";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return <UsersTable />;
      case "transactions":
        return <TransactionsTable />;
      case "contact":
        return <ContactUsTable />;
      case "memberships":
        return <MembershipsTable />;
      case "suppliments":
        return <Product />;
      case "trainers":
        return <Trainer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-pure-greys-900 relative">
      {/* Sidebar Toggle Button */}
      <button
        className="md:hidden p-3 fixed top-4 left-4 bg-card-active text-white rounded z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      <aside
        className={`fixed bg-card-active h-screen text-white transition-all duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-[250px] md:w-[250px] z-40`}
      >
        <h1 className="text-md my-5 md:mt-3 mt-9 font-bold  ml-5 py-4 border-b border-pure-greys-700">
          Admin Panel
        </h1>
        <ul>
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "users", label: "Users" },
            { key: "transactions", label: "Transactions" },
            { key: "contact", label: "Contact Us" },
            { key: "memberships", label: "Memberships" },
            { key: "suppliments", label: "Products" },
            { key: "trainers", label: "Trainers" },
          ].map((item) => (
            <li
              key={item.key}
              className={`py-3 px-5 cursor-pointer hover:bg-pure-greys-700 ${
                activeSection === item.key && "bg-pure-greys-700"
              }`}
              onClick={() => {
                setActiveSection(item.key);
                setIsSidebarOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:ml-64 ml-0 overflow-y-auto w-full">
        <h2 className="text-3xl md:my-4 font-bold my-10 mb-4">Admin Panel</h2>
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminPanel;
