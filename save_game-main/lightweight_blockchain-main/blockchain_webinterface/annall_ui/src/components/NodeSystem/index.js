import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const NodeSystem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate;
  const [title, settitle] = useState("");
  const [question, setquestion] = useState("");
  const [url, setUrl] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");
  const [answer1Correct, setAnswer1Correct] = useState(false);
  const [answer2Correct, setAnswer2Correct] = useState(false);
  const [answer3Correct, setAnswer3Correct] = useState(false);
  const [answer4Correct, setAnswer4Correct] = useState(false);
  const [errors, setErrors] = useState({ title: "", question: "", url: "" });
  const [correctAnswer, setCorrectAnswer] = useState("answer_1");
  const [userIsAuth, setUserIsAuth] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const handleChange = (e) => {
    setCorrectAnswer(e.target.value);
  };
  const validate = () => {
    let isValid = true;
    const le = { title: "", question: "", url: "" };
    if (title.length <= 0) {
      le["title"] = " can't be empty";
      isValid = false;
    }

    if (question.length < 6) {
      le["question"] = " should be at least 6 in length";
      isValid = false;
    }
    if (url.length < 5) {
      le["url"] = " should be at least 5 in length";
      isValid = false;
    }

    setErrors(le);
    return isValid;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuth = true;
    if (user == null) {
      setUserIsAuth(false);
      navigate("/user/login");
    }
    const fetchData = async () => {
      console.log("Here ");
    };
    fetchData();
  }, []);

  const handleOnSubmit = async (e) => {
    // Send to server
    e.preventDefault();
    console.log("Value ", correctAnswer);
    // If error then we don't dispatch
    //   if (!validate(title, question, url)) return;
    let correct1 = false;
    let correct2 = false;
    let correct3 = false;
    let correct4 = false;

    if (correctAnswer == "answer_1") {
      correct1 = true;
    } else if (correctAnswer == "answer_2") {
      correct2 = true;
    } else if (correctAnswer == "answer_3") {
      correct3 = true;
    } else {
      correct4 = true;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    console.log("The user ", user, "id ", user.id);
    console.log("The user right here on submit ", user);
    let theQuestions = [
      {
        title: "The biggest earwax in the world is?",
        options: [
          {
            value: "your aunt's pants",
            correct: true,
          },
          {
            value: "Your grandma",
            correct: false,
          },
        ],
      },
    ];

    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: title,
        titleImage: url,
        questions: theQuestions,
        owner: user,
      }),
    };
    let res = await fetch("http://localhost:4567/matches", requestOptions);
    console.log("Res ", res);

    let getRequest = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    let userRes = await fetch("http://localhost:4567/user/info", getRequest);
    console.log("user res ", userRes);
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
          IPSF URL
          {errors.url}
          <input
            type="text"
            value={url}
            title="url"
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <label>
          Description
          {errors.question}
          <input
            type="text"
            value={question}
            title="question"
            onChange={(e) => setquestion(e.target.value)}
          />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};
export default NodeSystem;
