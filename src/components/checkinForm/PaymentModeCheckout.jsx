import React, { useEffect, useState } from "react";
import CheckinCheckBox from "./CheckinCheckBox";
import CheckInInput from "./CheckInInput";
import FormErrorMessage from "../FormErrorMessage";
import MuiDatePicker from "../formElements/MuiDatePicker";

const PaymentModeCheckout = ({
  payment,
  setpayment,
  formError,
  setPaymentDate,
  paymentDate,
}) => {
  const [cashAmount, setCashAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [gpayAmount, setGpayAmount] = useState("");
  const [paymenttypeCheckbox, setpaymenttypeCheckbox] = useState([]);
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setpaymenttypeCheckbox((prev) => [...prev, value]);

      switch (value) {
        case "CARD":
          setpayment((prev) => [
            ...prev,
            { paymentMode: value, paidMoney: null },
          ]);
          break;
        case "UPI":
          setpayment((prev) => [
            ...prev,
            { paymentMode: value, paidMoney: null },
          ]);
          break;
        case "CASH":
          setpayment((prev) => [
            ...prev,
            { paymentMode: value, paidMoney: null },
          ]);
          break;
        case "BANK":
          setpayment((prev) => [
            ...prev,
            { paymentMode: value, paidMoney: null },
          ]);
          break;
        default:
          setpayment((prev) => [...prev]);
          break;
      }
    } else {
      const data = payment.filter((val) => val.paymentMode !== value);
      setpayment(data);
      setpaymenttypeCheckbox((prev) => {
        return [...prev.filter((val) => val !== value)];
      });
    }
  };

  useEffect(() => {
    const filter = payment.filter((item) => item.paymentMode !== "CARD");
    setpayment(filter);
    setpayment((prop) => [
      ...prop,
      { paymentMode: "CARD", paidMoney: cardAmount },
    ]);
  }, [cardAmount]);

  useEffect(() => {
    const filter = payment.filter((item) => item.paymentMode !== "UPI");
    setpayment(filter);
    setpayment((prop) => [
      ...prop,
      { paymentMode: "UPI", paidMoney: gpayAmount },
    ]);
  }, [gpayAmount]);
  useEffect(() => {
    const filter = payment.filter((item) => item.paymentMode !== "CASH");
    setpayment(filter);
    setpayment((prop) => [
      ...prop,
      { paymentMode: "CASH", paidMoney: cashAmount },
    ]);
  }, [cashAmount]);
  useEffect(() => {
    const filter = payment.filter((item) => item.paymentMode !== "BANK");
    setpayment(filter);
    setpayment((prop) => [
      ...prop,
      { paymentMode: "BANK", paidMoney: bankAmount },
    ]);
  }, [bankAmount]);
  useEffect(() => {
    setpayment([]);
  }, []);

  return (
    <div className="flex flex-col mb-10 gap-5">
      <div className="text-lg">PAYMENT MODE</div>
      <div className="flex justify-between gap-5">
        <div className="flex-1">
          <CheckinCheckBox
            label="CARD"
            handleCheckboxChange={handleCheckboxChange}
          />
          {paymenttypeCheckbox.includes("CARD") && (
            <>
              <div className="flex  gap-2 items-center mt-5">
                <div className="text-lg whitespace-nowrap">CARD *</div>
                <CheckInInput
                  type="number"
                  error={formError?.card}
                  placeholder="Enter Amount"
                  handleChange={(e) => setCardAmount(parseInt(e.target.value))}
                />
              </div>
              {formError?.card && <FormErrorMessage error={formError?.card} />}
            </>
          )}
        </div>
        <div className="flex-1">
          <CheckinCheckBox
            label="UPI"
            handleCheckboxChange={handleCheckboxChange}
          />
          {paymenttypeCheckbox.includes("UPI") && (
            <>
              <div className="flex  gap-2 items-center mt-5">
                <div className="text-lg whitespace-nowrap">UPI *</div>
                <CheckInInput
                  type="number"
                  error={formError?.upi}
                  placeholder="Enter Amount"
                  handleChange={(e) => setGpayAmount(parseInt(e.target.value))}
                />
              </div>
              {formError?.upi && <FormErrorMessage error={formError?.upi} />}
            </>
          )}
        </div>
        <div className="flex-1">
          <CheckinCheckBox
            label="CASH"
            handleCheckboxChange={handleCheckboxChange}
          />
          {paymenttypeCheckbox.includes("CASH") && (
            <>
              <div className="flex  gap-2 items-center mt-5">
                <div className="text-lg whitespace-nowrap">CASH *</div>
                <CheckInInput
                  type="number"
                  error={formError?.cash}
                  placeholder="Enter Amount"
                  handleChange={(e) => setCashAmount(parseInt(e.target.value))}
                />
              </div>
              {formError?.cash && <FormErrorMessage error={formError?.cash} />}
            </>
          )}
        </div>
        <div className="flex-1">
          <CheckinCheckBox
            label="BANK"
            handleCheckboxChange={handleCheckboxChange}
          />
          {paymenttypeCheckbox.includes("BANK") && (
            <>
              <div className="flex  gap-2 items-center mt-5">
                <div className="text-lg whitespace-nowrap">BANK *</div>

                <CheckInInput
                  type="number"
                  error={formError?.bank}
                  placeholder="Enter Amount"
                  handleChange={(e) => setBankAmount(parseInt(e.target.value))}
                />
              </div>
              {formError?.bank && <FormErrorMessage error={formError?.bank} />}
            </>
          )}
        </div>
      </div>
      <div className="flex gap-10 items-center mt-5">
        <label className="text-lg">
         Checkout Payment Date
        </label>
        <MuiDatePicker selected={paymentDate} setSeleceted={setPaymentDate} />
      </div>
    </div>
  );
};

export default PaymentModeCheckout;
