import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();


  // Creating a bool var to check if server response is ok or not
  const [formresponse, setFormResponse] = useState(true);



  const onSubmit = async (data) => {
    // console.log("Form submitted with data:", data);
    try {
      let r = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // console.log(r);
      let res = await r.text();

      console.log(data, res);
      if(r.status === 200){
        sessionStorage.setItem('authToken', res);
        alert('Sign Up Success')
        navigate('/login');
      }
      else{
        setFormResponse(false);
      }

    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <>
      {isSubmitting && <div className="loading">Loading</div>}
      <div className="signUp">
        <form action="/login" onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              {...register("firstName", { required: "First Name is required" })}
            />
            {errors.firstName && (
              <div className="error">{errors.firstName.message}</div>
            )}
          </div>
          <div className="field">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              {...register("lastName", { required: "Last Name is required" })}
            />
            {errors.lastName && (
              <div className="error">{errors.lastName.message}</div>
            )}
          </div>
          <div className="field">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <div className="error">{errors.email.message}</div>
            )}
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              {...register("password", {
                required: { value: true, message: "This is field is Required" },
                minLength: { value: 8, message: "Min Length is 8" },
                maxLength: { value: 15, message: "Max Length is 15" },
              })}
            />
            {errors.password && (
              <div className="error">{errors.password.message}</div>
            )}
          </div>
          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              {...register("confirmpassword", {
                required: { value: true, message: "This is field is Required" },
                minLength: { value: 8, message: "Min Length is 8" },
                maxLength: { value: 15, message: "Max Length is 15" },
              })}
            />
            {errors.confirmpassword && (
              <div className="error">{errors.confirmpassword.message}</div>
            )}
          </div>
          <div className="field">
            {!formresponse && (
              <div className="error">Email is already registered with us</div>
            )}
          </div>
          <div className="field">
            <input
              disabled={isSubmitting}
              className="button"
              value="Submit"
              type="submit"
            />
          </div>

        </form>
      </div>
    </>
  );
};

export default Signup;
