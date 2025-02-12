import React from "react";
import { Link } from "react-router-dom";

const Button = ({ text, color, path, hover }) => {
  return (
    <div>
      <Link to={path}>
        <button
          type="submit"
          className={`${color} px-4 py-2 ${hover} transition duration-200 font-[700]  text-[15px] rounded-lg`}
        >
          {text}
        </button>
      </Link>
    </div>
  );
};

export default Button;
