import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Login.css";



const Login = () => {
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();

  const delay = (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, t * 1000);
    });
  };
  const onSubmit = async (data) => {
    try {
      let r = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let resText = await r.text();
      let res = JSON.parse(resText);
      const authToken = res.authToken;
      console.log(authToken);

    
   
      if(r.status === 200 && res){
        sessionStorage.setItem('authToken', authToken);
        setUserStatus(true);
        navigate('/');
      }
      else if (r.status === 404){
        setUserStatus(false);
        console.log('Username not Found')
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
            <input
              disabled={isSubmitting}
              className="button"
              value="Login"
              type="submit"
            />
            {!userStatus && (
              <div className="error">Invalid Credentials</div>
            )}
          </div>

        </form>
      </div>
    </>
  );
}

export default Login
