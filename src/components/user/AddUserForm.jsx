import React, { useState } from "react";
import PageHeading from "../PageHeading";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import TextInput from "../formElements/TextInput";
import SelectBox from "../formElements/SelectBox";
import { userRequset } from "../../api/requestMethods";
import Spinner from "../spinner/Spinner";

const AddUserForm = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [loader, setLoader] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
    role: "",
  });
  const [roleselect, setRoleSelect] = useState("");
  const role = ["gm", "officeStaff", "kitchenstaff"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const data = { ...values, role: roleselect };
    const validation = await validate(data);
    setFormError(validation);
    if (Object.keys(validation).length === 0) {
      userRequset
        .post("/user/signup", data)
        .then((res) => {
          setLoader(false);
          navigate("/user");
        })
        .catch((err) => {
          setLoader(false);
          console.log(err);
        });
    } else {
      setLoader(false);
      console.log("Validation error");
    }
  };
  const validate = async (value) => {
    const error = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!value.name) {
      error.name = "Name is required!";
    }
    if (!value.email) {
      error.email = "Email is required!";
    } else if (!regex.test(value.email)) {
      error.email = "invalid Email Format ";
    }
    if (!value.role) {
      error.role = "Role is required!";
    }
    if (!value.password) {
      error.password = "password is required!";
    } else if (value.password.length < 6) {
      error.password = "password must have 6 digits";
    }
    if (!value.confirmPass) {
      error.confirmPass = "Conform Password is required!";
    } else if (value.password !== value.confirmPass) {
      error.confirmPass = "Pasword and Conform Password is Not matching";
    }

    return error;
  };

  return (
    <>
      <div className="relative">
        <PageHeading heading={"Add User"} />
        <div
          className="absolute top-[5px] -left-10 cursor-pointer"
          onClick={() => navigate("../")}
        >
          <FiChevronLeft size={40} className="text-[#161515]" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full h-auto bg-white rounded-lg p-10 "
      >
        <TextInput
          label="Name *"
          name="name"
          placeholder="Enter Full Name"
          type="text"
          error={formError.name}
          value={values.name}
          handleChange={handleChange}
        />
        <TextInput
          label="E-Mail ID *"
          placeholder="Enter E-mail ID"
          type="email"
          name="email"
          error={formError.email}
          value={values.email}
          handleChange={handleChange}
        />
        <SelectBox
          label={"Role *"}
          data={role}
          value={roleselect}
          error={formError.role}
          setValue={setRoleSelect}
        />
        <TextInput
          label="Password *"
          placeholder="Enter Password"
          type="password"
          name="password"
          error={formError.password}
          value={values.password}
          handleChange={handleChange}
        />
        <TextInput
          label="Confirm Pasword *"
          placeholder="Confirm Password"
          type="password"
          name="confirmPass"
          error={formError.confirmPass}
          value={values.confirmPass}
          handleChange={handleChange}
        />
        <div className="flex items-center flex-col gap-3  mt-10 ">
          <button
            type="submit"
            className={`w-[200px] ${
              !loader && "py-3"
            } text-lg text-white bg-secondary rounded-md`}
          >
            {loader ? (
              <Spinner color={"#ffffff"} width={"32px"} height={"32px"} />
            ) : (
              "Add User"
            )}
          </button>
          {Object.keys(formError).length !== 0 && (
            <div className="text-red-500">fill all required filed</div>
          )}
        </div>
      </form>
    </>
  );
};

export default AddUserForm;
