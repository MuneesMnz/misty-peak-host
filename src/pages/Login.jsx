import React, { useRef, useState } from "react";
import { IoPersonOutline, IoLockClosedOutline } from "react-icons/io5";
import { publicRequest, userRequset } from "../api/requestMethods";
import { useAuthContext } from "../hooks/useAuthContext";
import LogoSvg from "../assets/Images/Logo.svg";
import Spinner from "../components/spinner/Spinner";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const { dispatch } = useAuthContext();
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const forgetModalRef = useRef();
  const [forgetEmail, setforgetEmail] = useState("");
  const [formError, setformError] = useState({});
  const [passwordType, setPasswordType] = useState("password");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    let data = {
      email: userName,
      password: password,
    };

    const validation = await validate(data);
    setformError(validation);
    if (Object.keys(validation).length === 0) {
      publicRequest
        .post("/user/login", data)
        .then(async (res) => {
          if (res.data.user.role === "admin" || res.data.user.role === "gm") {
            const JSONData = JSON.stringify(res.data);
            localStorage.setItem("user", JSONData);
            console.log(res.data);
            setError("");
            setLoader(false);
            dispatch({ type: "LOGIN", payload: res.data });
          } else {
            alert("You Are Not Allowed");
          }
        })
        .catch((err) => {
          setLoader(false);
          if (err.response && err.response.data) {
            if (err.response.data.status === 400) {
              setError("Please fill Email and Password");
            } else if (err.response.data.status === 401) {
              setError("Incorrect Email and Password");
            }
          } else {
            setError("someting went wrong");
          }
        });
    } else {
      console.log("Validation error");
      setLoader(false);
    }
  };

  const validate = async (value) => {
    const error = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!value.email) {
      error.email = "Email is required!";
    } else if (!regex.test(value.email)) {
      error.email = "invalid Email Format ";
    }
    if (!value.password) {
      error.password = "password is required!";
    } else if (value.password.length < 6) {
      error.password = "password must have 6 digits";
    }
    return error;
  };

  const handleForgetPassword = (e) => {
    publicRequest.post("/user/forgetpassword", { email: forgetEmail });
  };
  return (
    <div className="flex w-full h-screen relative ">
      <div className="flex-[3] bg-white flex justify-center items-center ">
        <div>
          <img src={LogoSvg} alt="" />
        </div>
      </div>
      <div className="flex-[4] bg-primary flex justify-center items-center">
        <form
          className="w-[450px] h-[550px] bg-secondary rounded-lg px-10 py-14 flex flex-col justify-between"
          onSubmit={handleSubmit}
        >
          <div className="text-white text-5xl text-center font-400">Login</div>
          <div className="">
            <div className="mb-14">
              <div
                className={`w-full  ${
                  formError.email ? "border-b-red-800" : "border-b-white"
                } border-b-[2px] bg-transparent px-1  flex gap-2 items-center  `}
              >
                <input
                  type="text"
                  className="bg-transparent flex-1  h-10 outline-none placeholder:text-white text-white "
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <IoPersonOutline size={27} className="text-white" />
              </div>
              {formError?.email && (
                <div className="text-sm text-red-800 mt-3">
                  {formError.email}
                </div>
              )}
            </div>
            <div
              className={`w-full  ${
                formError.email ? "border-b-red-800" : "border-b-white"
              } border-b-[2px] bg-transparent px-1  flex gap-2 items-center `}
            >
              <input
                type={passwordType}
                className="bg-transparent flex-1 text-white h-10 outline-none placeholder:text-white  "
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="cursor-pointer">
                {passwordType !== "password" ? (
                  <AiFillEye
                    size={27}
                    className="text-white"
                    onClick={() => setPasswordType("password")}
                  />
                ) : (
                  <AiFillEyeInvisible
                    size={27}
                    className="text-white"
                    onClick={() => setPasswordType("text")}
                  />
                )}
              </div>
            </div>
            {formError?.password && (
              <div className="text-sm text-red-800 mt-3">
                {formError.password}
              </div>
            )}
          </div>
          <div className="flex justify-center items-center flex-col">
            <div className="mb-3">
              <button
                className={`w-[250px]  h-[50px] rounded-md bg-white text-2xl font-[400] `}
              >
                {loader ? (
                  <Spinner color={"#007942"} width={"32px"} height={"32px"} />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
            <p className="text-sm">
              Forget password ?
              <span
                className="text-white cursor-pointer ml-2"
                onClick={() => setOpen(true)}
              >
                Click here
              </span>
            </p>
            {error && <p className="mt-2 text-white font-semibold">{error}</p>}
          </div>
        </form>
      </div>
      {open && (
        <div className="absolute w-full h-screen bg-black/50 flex justify-center items-center">
          <div
            className="w-[500px] h-[280px] bg-white p-10 rounded-xl shadow-lg"
            ref={forgetModalRef}
          >
            {/* <div className="flex justify-center w-[50px] h-[50px] bg-secondary/20 rounded-full"><BiKey  /></div> */}
            <div className="text-center font-[500] text-2xl">
              Forget password ?
            </div>
            <div className="flex flex-col gap-5 items-center mt-5">
              <input
                type="email"
                placeholder="enter your email"
                value={forgetEmail}
                onChange={(e) => setforgetEmail(e.target.value)}
                className="w-[300px] h-[40px] border border-secondary rounded px-2 outline-none text-[15px]"
              />
              <button
                className="w-[300px] h-[40px] rounded bg-secondary text-white "
                onClick={handleForgetPassword}
              >
                Reset Password
              </button>
              <span
                className="text-secondary text-sm cursor-pointer"
                onClick={() => setOpen(false)}
              >
                back to signin
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
