import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NFTSystem = () => {
  const [url, setUrl] = useState("api/blocks?key=1");
  const dispatch = useDispatch();
  const navigate = useNavigate;
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [imageURL, setimageURL] = useState(
    "https://ipfs.io/ipfs/QmTQbgm8ck971MQm8hRJ9Lzxd4oxWmtf22eDSjs3TxTp1T?filename=Drunk_phase"
  );
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");
  const [answer1Correct, setAnswer1Correct] = useState(false);
  const [answer2Correct, setAnswer2Correct] = useState(false);
  const [answer3Correct, setAnswer3Correct] = useState(false);
  const [answer4Correct, setAnswer4Correct] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    imageURL: "",
  });
  const [correctAnswer, setCorrectAnswer] = useState("answer_1");
  const [userIsAuth, setUserIsAuth] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const altImage = "https://static.thenounproject.com/png/396915-200.png";
  const getDict = () => {
    return {
      previous_hash: "4d3e9b1e-816f-473b-8bd2-dd642681f07d",
      writer_signature: "0a442720-2707-4e3e-b5cc-9c65b806bd1c",
      writer_id: "0a442720-2707-4e3e-b5cc-9c65b806bd1c",
      coordinator_id: 3,
      winner_number: 2,
      payload: {
        id: 43,
        name: title,
        description: description,
        type: "NFT",
        data: {
          imageURL: imageURL,
        },
      },
    };
  };
  const handleChange = (e) => {
    console.log("Change");
    if (e === "url") {
      setimageURL(e.target.value);
    }
  };
  const validate = () => {
    let isValid = true;
    const le = { title: "", description: "", imageURL: "" };
    if (title.length <= 0) {
      le["title"] = " can't be empty";
      isValid = false;
    }

    if (description.length < 6) {
      le["description"] = " should be at least 6 in length";
      isValid = false;
    }
    if (imageURL.length < 5) {
      le["imageURL"] = " should be at least 5 in length";
      isValid = false;
    }

    setErrors(le);
    return isValid;
  };

  useEffect(() => {
    const form = JSON.parse(localStorage.getItem("form"));
  }, []);

  const form = JSON.parse(localStorage.getItem("form"));

  const createBlock = () => async (blockObj) => {
    console.log("Inside get matches ");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    console.log("DOing cool stuff ", blockObj);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        console.log("Here ");
        const res = await axios.post(url, getDict());
        console.log(" sdafdsa f ", res.data);
      } catch (e) {
        console.log("error");
      }
      console.log("In create nft ");
      console.log("get dict  ", getDict());
      const blockObj = getDict();
      dispatch(createBlock(blockObj));
    }
  };

  return (
    <div>
      <h1>Create NFT!</h1>
      <form action="" method="get" onSubmit={(e) => handleOnSubmit(e)}>
        <label>
          Title of NFT
          {errors.title}
          <input
            type="text"
            value={title}
            title="title"
            onChange={(e) => settitle(e.target.value)}
          />
        </label>

        <label>
          IPSF imageURL
          {errors.imageURL}
          <input
            type="text"
            value={imageURL}
            title="imageURL"
            onChange={(e) => setimageURL(e.target.value)}
          />
        </label>
        <label>
          Description
          {errors.description}
          <input
            type="text"
            value={description}
            title="description"
            onChange={(e) => setdescription(e.target.value)}
          />
        </label>

        <button type="submit">Create</button>
      </form>
      <div>
        <div id="left-side">
          <div id="profile-pic">
            {" "}
            <img src={imageURL} id="profilepic" />{" "}
          </div>
          <div id="profile-name">{title} </div>
          <div id="profile-username"> {description} </div>
        </div>
      </div>
    </div>
  );
};
export default NFTSystem;
