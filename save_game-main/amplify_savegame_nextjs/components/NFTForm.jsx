import React from "react";

const NFTForm = () => {
  return (
    <>
      <div className="form-main-outer">
        <div className="form-main-inner">
          <form>
            <label>
              Wallet Address
              <br />
              <input type="text" name="name" />
            </label>
            <button className="btn" type="button" value="Login">
              Add Wallet
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NFTForm;
