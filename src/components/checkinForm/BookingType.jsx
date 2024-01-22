import React, { useEffect, useRef, useState } from "react";
import CheckinFormHeading from "./CheckinFormHeading";
import RadioButtonGroup from "../formElements/RadioButton";
import CheckInInput from "./CheckInInput";
import { userRequset } from "../../api/requestMethods";
import FormErrorMessage from "../FormErrorMessage";
const Label = ({ label }) => {
  return (
    <label htmlFor="" className="text-lg font-semibold ">
      {label}
    </label>
  );
};
const BookingTypeComp = ({
  payment,
  values,
  setValues,
  TACtype,
  setTACtype,
  formError,
}) => {
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const [agentNameslist, setAgentNameslist] = useState([]);
  const agentRef = useRef();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setValues((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    setValues((prev) => ({ ...prev, tacisPaid: TACtype }));
  }, [TACtype]);
  const TACoptions = [
    {
      name: "paid",
      value: true,
    },
    {
      name: "unpaid",
      value: false,
    },
  ];
  const getAgents = async () => {
    try {
      const res = await userRequset.get("/agents");
      const names = await res.data.data.map((value) => value.agencyName).sort();
      setAgentNameslist(names);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAgents();
    const handleOutsideClick = (e) => {
      if (agentRef.current && !agentRef.current.contains(e.target)) {
        setAutoCompleteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  return (
    <div className="mb-10">
      <CheckinFormHeading heading="B2B Info" />

      <div className="flex flex-col gap-2 mb-5 relative  ">
        <Label label={payment ? "Agent Name *" : "Platform Name *"} />
        <CheckInInput
          placeholder="Enter Full Name"
          name={payment ? "agentName" : "platformName"}
          value={payment ? values.agentName : values.platformName}
          error={
            payment
              ? formError?.booking?.[0]?.agentName
              : formError?.booking?.[0]?.platformName
          }
          handleChange={handleChange}
          onFocus={() => setAutoCompleteOpen(true)}
          // onBlur={() => setAutoCompleteOpen(false)}
        />
        {payment
          ? formError?.booking?.[0]?.agentName && (
              <FormErrorMessage error={formError?.booking?.[0]?.agentName} />
            )
          : formError?.booking?.[0]?.platformName && (
              <FormErrorMessage error={formError?.booking?.[0]?.platformName} />
            )}
        {payment && autoCompleteOpen && (
          <div
            className="absolute top-[90px] left-0 w-full max-h-[200px] bg-white shadow-md py-2 overflow-y-scroll "
            ref={agentRef}
          >
            {agentNameslist
              ?.filter((item) => {
                const searchItem = values.agentName.toLowerCase();
                const fullName = item?.toLowerCase();
                return fullName?.startsWith(searchItem);
              })
              .map((names, ind) => {
                if (!names) {
                  return (
                    <div key={ind} className="px-5 py-2">
                      No Agent name Found
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={ind}
                      className="px-5 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setValues((prev) => ({ ...prev, agentName: names }));
                        setAutoCompleteOpen(false);
                      }}
                    >
                      {names}
                    </div>
                  );
                }
              })}
          </div>
        )}
      </div>
      <div className="flex gap-10 my-10">
        <div className="flex-1 flex flex-col gap-2 ">
          <Label label="B2B *" />
          <CheckInInput
            placeholder="Enter Room Tariff"
            name="btb"
            type="number"
            error={formError?.booking?.[0]?.btb}
            value={values.btb}
            handleChange={handleChange}
          />
          {formError?.booking?.[0]?.btb && (
            <FormErrorMessage error={formError?.booking?.[0]?.btb} />
          )}
        </div>
        <div className="flex-1  flex flex-col gap-2">
          <Label label="B2C *" />
          <CheckInInput
            placeholder="Enter Room Tariff"
            name="btc"
            type="number"
            error={formError?.booking?.[0]?.btc}
            value={values.btc}
            handleChange={handleChange}
          />
          {formError?.booking?.[0]?.btc && (
            <FormErrorMessage error={formError?.booking?.[0]?.btc} />
          )}
        </div>
        {/* {payment && (
          <div className="flex-1  flex flex-col gap-2">
            <Label label="Credit *" />
            <CheckInInput
              placeholder="Enter credit"
              name="credit"
              type="number"
              error={formError?.booking?.[0]?.credit}
              value={values.credit}
              handleChange={handleChange}
            />
            {formError?.booking?.[0]?.credit && (
              <FormErrorMessage error={formError?.booking?.[0]?.credit} />
            )}
          </div>
        )} */}
      </div>
      <div className="w-[500px] ">
        <RadioButtonGroup
          label={"TAC"}
          options={TACoptions}
          selected={TACtype}
          setSelected={setTACtype}
        />
      </div>

      <div className="flex gap-10 my-10">
        <div className="flex-1 flex flex-col gap-2 ">
          <Label label="TAC *" />
          <CheckInInput
            placeholder="Enter TAC"
            name={"tacamount"}
            value={values.tacamount}
            error={formError?.booking?.[0]?.tacamount}
            type="number"
            handleChange={handleChange}
          />
          {formError?.booking?.[0]?.tacamount && (
            <FormErrorMessage error={formError?.booking?.[0]?.tacamount} />
          )}
        </div>
        <div className="flex-1  flex flex-col gap-2">
          <Label label="Balance *" />
          <CheckInInput
            placeholder="Enter Balance"
            name="tacBalnce"
            value={values.tacBalnce}
            error={formError?.booking?.[0]?.tacBalnce}
            handleChange={handleChange}
            type="number"
          />
          {formError?.booking?.[0]?.tacBalnce && (
            <FormErrorMessage error={formError?.booking?.[0]?.tacBalnce} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingTypeComp;
