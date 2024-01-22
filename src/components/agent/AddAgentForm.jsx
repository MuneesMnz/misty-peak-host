import React, { useState } from "react";
import PageHeading from "../PageHeading";
import TextInput from "../formElements/TextInput";
import { userRequset } from "../../api/requestMethods";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import Spinner from "../spinner/Spinner";

const AddAgentForm = () => {
  const navigate = useNavigate();
  const [loader,setLoader]=useState(false)
  const [formvalue, setFormValue] = useState({
    agentName: "",
    agentNumber: "",
    email: "",
    agencyName: "",
  });
  const [formError, setFormError] = useState({});

  const handleChange = (e, type) => {
    if (type === "number") {
      setFormValue((prev) => ({
        ...prev,
        [e.target.name]: parseInt(e.target.value),
      }));
    } else {
      setFormValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true)
    const validation = await validate(formvalue);
    setFormError(validation);

    if (Object.keys(validation).length === 0) {
      userRequset
        .post("/agents", formvalue)
        .then(() => {
          setLoader(false)
          navigate("/b2b");
        })
        .catch((err) => {
          setLoader(false)
          console.log(err);
        });
    } else {
      setLoader(false)
      console.log("Validation error");
    }
  };

  const validate = async (value) => {
    const error = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!value.agentName) {
      error.agentName = "Name is required!";
    } else if (value.agentName.length < 4) {
      error.agentName = "Name must have 4 digits";
    }
    if (!value.agencyName) {
      error.agencyName = "Agency Name is required!";
    }
    if (!value.agentNumber) {
      error.agentNumber = "Phone Number is required!";
    } else if (value.agentNumber.toString().length < 10) {
      error.agentNumber = "Minimum 10 Digit required!";
    }
    if (!value.email) {
      error.email = "Email is required!";
    } else if (!regex.test(value.email)) {
      error.email = "invalid Email Format ";
    }

    return error;
  };
  return (
    <>
      <div className="relative">
        <PageHeading heading="Add Agent" />
        <div
          className="absolute top-[5px] -left-10 cursor-pointer"
          onClick={() => navigate("../")}
        >
          <FiChevronLeft size={40} className="text-[#161515]" />
        </div>
      </div>
      <form
        className="w-full h-auto rounded-md bg-white shadow p-10"
        onSubmit={handleSubmit}
      >
        <TextInput
          label="Name *"
          type="text"
          placeholder="Enter Full Name"
          name="agentName"
          error={formError.agentName}
          value={formvalue.agentName}
          handleChange={handleChange}
        />
        <TextInput
          label="Agency Name *"
          type="text"
          placeholder="Enter Agency Name"
          name="agencyName"
          error={formError.agencyName}
          value={formvalue.agencyName}
          handleChange={handleChange}
        />
        <TextInput
          label="Email ID *"
          type="email"
          placeholder="Enter Email ID "
          name="email"
          error={formError.email}
          value={formvalue.email}
          handleChange={handleChange}
        />
        <TextInput
          label="Phone Number *"
          type="number"
          placeholder="Enter Phone Number"
          name="agentNumber"
          error={formError.agentNumber}
          value={formvalue.agentNumber}
          handleChange={(e) => handleChange(e, "number")}
        />
        <div className="flex items-center flex-col gap-3 mt-10">
          <button
            type="submit"
            className={`w-[200px] ${!loader && "py-3"} text-lg text-white bg-secondary rounded-md`}
          >
            {loader ? (
              <Spinner color={"#ffffff"} width={"32px"} height={"32px"} />
            ) : (
              "Add Agent"
            )}
          </button>
              {
                Object.keys(formError).length !== 0 && <div className="text-red-500">fill all required filed</div>
              }
        </div>
      </form>
    </>
  );
};

export default AddAgentForm;
