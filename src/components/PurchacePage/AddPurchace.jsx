import { useEffect, useState } from "react";
import PageHeading from "../PageHeading";
import DatePickerField from "../formElements/DatePickerField";
import RadioButtonGroup from "../formElements/RadioButton";
import SelectBox from "../formElements/SelectBox";
import TextInput from "../formElements/TextInput";
import { userRequset } from "../../api/requestMethods";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import InputAndSelect from "../formElements/InputAndSelect";
import { FiChevronLeft } from "react-icons/fi";
import Spinner from "../spinner/Spinner";

const AddPurchace = () => {
  const [selected, setSelected] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dateSelected, setDateSeleceted] = useState(
    moment(new Date()).format("YYYY-MM-DD HH:mm:ss.SSS")
  );
  const [itemSelect, setItemSelect] = useState("");
  const navigate = useNavigate();

  const [formValue, setFormValue] = useState({
    item: itemSelect,
    employeeName: "",
    villaNumber: "",
    clientName: "",
    amount: "",
    quantity: "",
    isPaid: selected,
    dateOfPurachse: dateSelected,
    otherItem: "",
  });

  console.log(formValue);
  useEffect(() => {
    setFormValue((prev) => ({ ...prev, isPaid: selected }));
  }, [selected]);
  useEffect(() => {
    setFormValue((prev) => ({ ...prev, dateOfPurachse: dateSelected }));
  }, [dateSelected]);
  useEffect(() => {
    setFormValue((prev) => ({ ...prev, item: itemSelect }));
  }, [itemSelect]);

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
  const list = ["Liter", "Kilogram", "Count"];
  const [unitSelect, setUnitSelect] = useState("");
  const [formError, setformError] = useState({});

  const itemList = [
    "Rent",
    "Salary",
    "Laundary",
    "Fuel",
    "Gas",
    "Water",
    "Milk",
    "Grocery",
    "Vegetables",
    "Chiken",
    "Fish",
    "Villa maintanance",
    "Others",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formValue, unit: unitSelect };
    setLoader(true)
    const validation = await validate(data);
    setformError(validation);
    if (Object.keys(validation).length === 0) {
      userRequset
        .post("/purchase", data)
        .then((res) => {
          console.log(res);
          setLoader(false)
          navigate("/purchase");
        })
        .catch((err) => {
          console.log(err);
          setLoader(false)
        });
    } else {
      console.log("Validation error");
      setLoader(false)
    }
  };
  const optionsRadioButton = [
    {
      name: "paid",
      value: true,
    },
    {
      name: "unpaid",
      value: false,
    },
  ];

  const validate = async (value) => {
    const error = {};
    if (!value.item) {
      error.item = "Item is Required";
    }
    if (value.item === "Rent") {
      if (!value.villaNumber) {
        error.villaNumber = "Villa Number is required";
      }
      if (!value.clientName) {
        error.clientName = " Client Name is required";
      }
    }
    if (value.item === "Salary") {
      if (!value.employeeName) {
        error.employeeName = " Employee Name is required";
      }
    }
    if (value.item === "Others") {
      if (!value.otherItem) {
        error.otherItem = " New Item is required";
      }
    }

    if (!value.quantity) {
      error.quantity = "Quantity is required";
    }
    if (!value.unit) {
      error.unit = "Unit is required";
    }
    if (!value.amount) {
      error.amount = "Amount is required";
    }

    return error;
  };
  return (
    <>
      <div className="relative">
        <PageHeading heading={"Add Purchase"} />
        <div
          className="absolute top-[5px] -left-10 cursor-pointer"
          onClick={() => navigate("../")}
        >
          <FiChevronLeft size={40} className="text-[#161515]" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full p-12 bg-white rounded-lg shadow-md mt-10"
      >
        <SelectBox
          label={"Item *"}
          data={itemList}
          value={itemSelect}
          setValue={setItemSelect}
          error={formError?.item}
        />

        {itemSelect === "Rent" && (
          <>
            <TextInput
              label="Villa Number *"
              placeholder="Enter Villa Number"
              type="number"
              name="villaNumber"
              error={formError.villaNumber}
              value={formValue.villaNumber}
              handleChange={handleChange}
            />
            <TextInput
              label="Client Name *"
              placeholder="Enter Client Name"
              type="text"
              error={formError.clientName}
              name="clientName"
              value={formValue.clientName}
              handleChange={handleChange}
            />
          </>
        )}

        {itemSelect === "Salary" && (
          <TextInput
            label="Employee Name *"
            placeholder="Enter Employee Name"
            error={formError.employeeName}
            type="text"
            name="employeeName"
            value={formValue.employeeName}
            handleChange={handleChange}
          />
        )}
        {itemSelect === "Others" && (
          <TextInput
            label="New Item *"
            error={formError.otherItem}
            placeholder="Enter New Item"
            type="text"
            name="otherItem"
            value={formValue.otherItem}
            handleChange={handleChange}
          />
        )}
        <InputAndSelect
          label={"Quantity *"}
          placeholder="Enter Quantity"
          type="number"
          name="quantity"
          formError={formError}
          value={formValue.quantity}
          handleChange={handleChange}
          selected={unitSelect}
          setselected={setUnitSelect}
          list={list}
        />
        <TextInput
          label={"Amount *"}
          placeholder="Enter Amount"
          type="number"
          error={formError.amount}
          name="amount"
          value={formValue.amount}
          handleChange={handleChange}
        />
        <DatePickerField
          dateSelected={dateSelected}
          setDateSelected={setDateSeleceted}
          dateFormat={"YYYY-MM-DD HH:mm:ss.SSS"}
        />
        <RadioButtonGroup
          label="Payment"
          options={optionsRadioButton}
          selected={selected}
          setSelected={setSelected}
        />

        <div className="flex flex-col gap-3 items-center mt-20">
          <button className={`w-[300px] h-auto ${!loader&&"py-3" }  text-white bg-secondary rounded-md`}>
            {loader ? (
              <Spinner color={"#ffffff"} width={"32px"} height={"32px"} />
            ) : ( 
              "Add Purchase"
            )}
          </button>
          {
            Object.keys(formError).length !== 0 && <div className="text-red-500">fill all required fields</div>
          }
        </div>
      </form>
    </>
  );
};

export default AddPurchace;
