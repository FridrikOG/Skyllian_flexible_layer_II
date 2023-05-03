import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";

const CreateNFT = () => {
  return <></>;
};

// const CreateNFT = () => {
//   const dispatch = useDispatch();
//   // const navigate = useNavigate;
//   const [title, settitle] = useState("");
//   const [question, setquestion] = useState("");
//   const [url, setUrl] = useState("");
//   const [answer1, setAnswer1] = useState("");
//   const [answer2, setAnswer2] = useState("");
//   const [answer3, setAnswer3] = useState("");
//   const [answer4, setAnswer4] = useState("");
//   const [answer1Correct, setAnswer1Correct] = useState(false);
//   const [answer2Correct, setAnswer2Correct] = useState(false);
//   const [answer3Correct, setAnswer3Correct] = useState(false);
//   const [answer4Correct, setAnswer4Correct] = useState(false);
//   const [errors, setErrors] = useState({ title: "", question: "", url: "" });
//   const [correctAnswer, setCorrectAnswer] = useState("answer_1");
//   const [userIsAuth, setUserIsAuth] = useState(false);
//   const [userInfo, setUserInfo] = useState("");
//   const handleChange = (e) => {
//     setCorrectAnswer(e.target.value);
//   };
//   const validate = () => {
//     let isValid = true;
//     const le = { title: "", question: "", url: "" };
//     if (title.length <= 0) {
//       le["title"] = " can't be empty";
//       isValid = false;
//     }

//     if (question.length < 6) {
//       le["question"] = " should be at least 6 in length";
//       isValid = false;
//     }
//     if (url.length < 5) {
//       le["url"] = " should be at least 5 in length";
//       isValid = false;
//     }
//     if (answer1.length < 3) {
//       le["answer1"] = " should be at least 3 in length";
//       isValid = false;
//     }
//     if (answer2.length < 3) {
//       le["answer2"] = " should be at least 3 in length";
//       isValid = false;
//     }
//     if (answer3.length < 3) {
//       le["answer3"] = " should be at least 3 in length";
//       isValid = false;
//     }
//     if (answer4.length < 3) {
//       le["answer4"] = " should be at least 3 in length";
//       isValid = false;
//     }

//     setErrors(le);
//     return isValid;
//   };

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const isAuth = true;
//     if (user == null) {
//       setUserIsAuth(false);
//       navigate("/user/login");
//     }
//     const fetchData = async () => {
//       const requestOptions = {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//       };

//       const userData = await fetch(
//         "http://localhost:4567/user/info",
//         requestOptions
//       );
//       console.log("user data ", userData);
//       if (!userData.ok) {
//         console.log("user not auth");
//       } else {
//         console.log("user ok");
//         const userInfo = await userData.json();
//         console.log("Logging user info ", userInfo);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleOnSubmit = async (e) => {
//     // Send to server
//     e.preventDefault();
//     console.log("Value ", correctAnswer);
//     // If error then we don't dispatch
//     //   if (!validate(title, question, url)) return;
//     //   let correct1 = false
//     //   let correct2 = false
//     //   let correct3 = false
//     //   let correct4 = false

//     // if (correctAnswer == "answer_1"){
//     //     correct1 = true
//     // } else if (correctAnswer == "answer_2"){
//     //     correct2 = true
//     // } else if (correctAnswer == "answer_3") {
//     //     correct3 = true
//     // } else {
//     //     correct4 = true
//     // }

//     let answers = [];
//     if (correctAnswer == answer1) {
//       answers.push({
//         value: answer1,
//         correct: true,
//       });
//     } else {
//       answers.push({
//         value: answer1,
//         correct: false,
//       });
//     }

//     if (correctAnswer == answer2) {
//       answers.push({
//         value: answer2,
//         correct: true,
//       });
//     } else {
//       answers.push({
//         value: answer2,
//         correct: false,
//       });
//     }

//     if (correctAnswer == answer3) {
//       answers.push({
//         value: answer3,
//         correct: true,
//       });
//     } else {
//       answers.push({
//         value: answer3,
//         correct: false,
//       });
//     }
//     if (correctAnswer == answer4) {
//       answers.push({
//         value: answer4,
//         correct: true,
//       });
//     } else {
//       answers.push({
//         value: answer4,
//         correct: false,
//       });
//     }

//     let finalProduct = [
//       {
//         title: question,
//         options: [answers],
//       },
//     ];

//     const user = JSON.parse(localStorage.getItem("user"));

//     let requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({
//         title: title,
//         titleImage: url,
//         questions: finalProduct,
//         owner: user,
//       }),
//     };
//     let res = await fetch("http://localhost:4567/matches", requestOptions);
//     console.log("Res ", res);

//     let getRequest = {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     };
//     let userRes = await fetch("http://localhost:4567/user/info", getRequest);
//     console.log("user res ", userRes);
//   };

//   return (
//     <div>
//       <h1>Create match!</h1>
//       <form action="" method="get" onSubmit={(e) => handleOnSubmit(e)}>
//         <label>
//           title
//           {errors.title}
//           <input
//             type="text"
//             value={title}
//             title="title"
//             onChange={(e) => settitle(e.target.value)}
//           />
//         </label>

//         <label>
//           Image
//           {errors.url}
//           <input
//             type="text"
//             value={url}
//             title="url"
//             onChange={(e) => setUrl(e.target.value)}
//           />
//         </label>
//         <label>
//           question
//           {errors.question}
//           <input
//             type="text"
//             value={question}
//             title="question"
//             onChange={(e) => setquestion(e.target.value)}
//           />
//         </label>
//         <label>
//           answer 1{errors.answer1}
//           <input
//             type="text"
//             value={answer1}
//             title="answer1"
//             onChange={(e) => setAnswer1(e.target.value)}
//           />
//         </label>
//         <label>
//           answer 2{errors.answer2}
//           <input
//             type="text"
//             value={answer2}
//             title="answer1"
//             onChange={(e) => setAnswer2(e.target.value)}
//           />
//         </label>
//         <label>
//           answer 3{errors.answer3}
//           <input
//             type="text"
//             value={answer3}
//             title="answer3"
//             onChange={(e) => setAnswer3(e.target.value)}
//           />
//         </label>
//         <label>
//           answer 4{errors.answer4}
//           <input
//             type="text"
//             value={answer4}
//             title="answer4"
//             onChange={(e) => setAnswer4(e.target.value)}
//           />
//         </label>
//         <label>
//           Which one is correct
//           <select name="option" onChange={handleChange}>
//             <option value={answer1}>Answer 1</option>
//             <option value={answer2}>Answer 2</option>
//             <option value={answer3}>Answer 3</option>
//             <option value={answer4}>Answer 4</option>
//           </select>
//         </label>

//         <button type="submit">Create</button>
//       </form>
//     </div>
//   );
// };
export default CreateNFT;
