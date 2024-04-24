import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./CreateQuizz.css";

const Createquizz = () => {
  const navigate = useNavigate();
  const [isquizzId, setIsQuizzId] = useState(false);
  const [reserror, setresError] = useState(false);

  // React Hook Form

  const [userStatus, setUserStatus] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();

  // .Checking if User is Authorised or not
  const Authorised = false;
  const CheckUser = () => {
    const authToken = sessionStorage.getItem("authToken");

    console.log(authToken);
  };

  const onSubmit = async (data) => {
    const authToken = sessionStorage.getItem("authToken");
    CheckUser();
    console.log(data);
    try {
      let r = await fetch("http://localhost:3000/quizz/generatequizzid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify(data),
      });
      let resText = await r.text();
      let res = JSON.parse(resText);
      console.log(res.quizzId);
      const quizzId = res.quizzId;
      setIsQuizzId(true);
      console.log(quizzId);

      if (r.status === 200 && res) {
        // sessionStorage.getItem('authToken', authToken);
        setUserStatus(true);
        alert("Quizz Generated Succesfully", quizzId);
        navigate(`/generatequestions/${quizzId}`);
      } else if (r.status === 404) {
        setUserStatus(false);
        console.log("Username not Found");
      }
    } catch (error) {
      setresError(true);
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <div className="createquizz">
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="createQuizzContainer">
          <div className="field">
            <label htmlFor="">Title of Quizz</label>
            <input
              type="text"
              {...register("title", {
                required: { value: true, message: "Quizz name is Required" },
              })}
            />
            {errors.title && (
              <div className="error">{errors.title.message}</div>
            )}
          </div>

          <div className="field">
            <label htmlFor="">Description</label>
            <textarea
              type="text"
              {...register("description", {
                required: { value: true, message: "Quizz name is Required" },
                maxLength:{value:100  , message: "Max Length Should be 100"},
              })}
            ></textarea>
            
            {errors.description && (
              <div className="error">{errors.description.message}</div>
            )}
          </div>

          <div className="field">
            <input type="submit" value="Create Quizz" disabled={isSubmitting} />
          </div>
        </div>
      </form>

      {isquizzId && (
        <div className="message">
          Quizz Created Successfully.
          <br />
          your QuizzId is {quizzId}
        </div>
      )}
      {reserror && (
        <div className="message">
          Some Error Occured Please try again
          <br />
          <button onClick={() => setresError(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Createquizz;
