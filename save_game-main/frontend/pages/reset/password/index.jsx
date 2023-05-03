import React, { useState } from "react";
import userService from "../../../service/userService";

const password = ({ query }) => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const handleRqChangePassword = async () => {
    const data = await userService.requestChangePassword(email);
    setMsg(data.success);
  };

  const handleChangeInput = (e) => {
    setEmail(e.target.value);
    setMsg("");
  };
  return (
    <div className="form-main-outer">
      <form className="container">
        <h1> Reset Password</h1>
        <input
          type="email"
          placeholder="Enter your email address"
          onChange={(e) => handleChangeInput(e)}
        />
        <button
          type="button"
          className="btn"
          value="ResetButton"
          onClick={handleRqChangePassword}
        >
          Reset Password
        </button>
        {msg}
      </form>
    </div>
  );
};

export default password;
