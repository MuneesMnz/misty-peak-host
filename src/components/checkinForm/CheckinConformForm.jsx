import React, { useEffect, useState } from "react";
import CheckinFormHeading from "./CheckinFormHeading";
import moment from "moment";
import CheckInInput from "./CheckInInput";
import { useNavigate, useParams } from "react-router-dom";
import { userRequset } from "../../api/requestMethods";
import LoadingImage from "../LoadingImage";
import PaymentModeCheckout from "./PaymentModeCheckout";
import FormErrorMessage from "../FormErrorMessage";
import Spinner from "../spinner/Spinner";
import PaymentModeDisplay from "./PaymentModeDisplay";

const RoundedButton = ({ value, green, flex }) => {
  return (
    <div
      className={`w-full h-[50px] ${
        green
          ? "bg-secondary text-white "
          : "bg-white text-secondary border border-borderGray  "
      } shadow-md rounded-full flex  justify-around items-center ${
        flex && "flex-[2] "
      } `}
    >
      {value}
    </div>
  );
};

const CheckinConformForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedData, setSelectedData] = useState({});
  const [payment, setPayment] = useState([]);
  const [balanceToPaid, setBalanceToPaid] = useState(null);
  const [mainLoader, setmainLoader] = useState(false);
  const [addOnBills, setaddOnBills] = useState(null);
  const [formError, setFormError] = useState({});
  const [total, setTotal] = useState(0);
  const [loader, setLoader] = useState(false);
  const [reservationPaidMoney, setReservationPaidMoney] = useState(0);
  const [checkinPaidMoney, setCheckinPaidMoney] = useState(0);

  const [paymentDate, setPaymentDate] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const getWaitlist = async () => {
    try {
      const responce = await userRequset.get("/book/checkoulIst");
      const item = await responce.data.data.data?.find(
        (value) => value._id === id
      );
      setSelectedData(item);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWaitlist();
  }, []);

  const [values, setValues] = useState({
    addOnbills: "",
    totalBill: "",
    discount: 0,
    remarks: "",
    credit: "",
    checkOutPayment: [],
    checkOutPaidDate: "",
  });

  useEffect(() => {
    const addOnBillsAmount = selectedData?.addOns;
    console.log(addOnBillsAmount);
    // let sum = 0;
    const totalAmountAddons = addOnBillsAmount?.reduce(
      (sum, value) => sum + value.amount,
      0
    );
    // addOnBillsAmount.forEach((val) => {
    //   sum += val.amount;
    // });
    setaddOnBills(totalAmountAddons);

    setTotal(addOnBills + selectedData?.rmTariff);

    let reservationAdvmoney = selectedData?.reservationPayment?.reduce(
      (sum, item) => sum + item.paidMoney,
      0
    );
    setReservationPaidMoney(reservationAdvmoney);
    let checkinAdvmoney = selectedData?.checkInPayment?.reduce(
      (sum, item) => sum + item.paidMoney,
      0
    );
    setCheckinPaidMoney(checkinAdvmoney);
    // console.log(checkinAdvmoney);

    setValues((prev) => ({ ...prev, remarks: selectedData.remarks }));

    const balancePayment = total - (reservationPaidMoney + checkinPaidMoney);
    setBalanceToPaid(balancePayment);
  }, [selectedData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };
  console.log("selected", selectedData);

  useEffect(() => {
    const billValue =
      parseFloat(
        addOnBills +
          selectedData?.rmTariff -
          (reservationPaidMoney + checkinPaidMoney)
      ) || 0;
    const discountValue = parseFloat(values.discount) || 0;
    setTotal(billValue - discountValue);
  }, [values.totalBill, values.discount]);

  useEffect(() => {
    //payment Date
    const selectedPaymentDate = new Date(paymentDate);
    const paymentYear = selectedPaymentDate.getFullYear();
    const paymentMonth = String(selectedPaymentDate.getMonth() + 1).padStart(
      2,
      "0"
    );
    const paymentDay = String(selectedPaymentDate.getDate()).padStart(2, "0");

    const formatedPaymentDate = `${paymentYear}-${paymentMonth}-${paymentDay}`;

    setValues((prev) => ({ ...prev, checkOutPaidDate: formatedPaymentDate }));
  }, [paymentDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...values,
      finalBill: total,
      checkOutPayment: payment,
      addOnbills: addOnBills,
    };
    console.log(data);
    setLoader(true);
    const validation = await validate(data);
    setFormError(validation);

    if (Object.keys(validation).length === 0) {
      setLoader(true);
      userRequset
        .put(`/book/checkout/${id}`, data)
        .then((res) => {
          console.log(res.data);
          setLoader(false);
          navigate("/booking/history");
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
        });
      console.log(data);
    } else {
      console.log("error");
      setLoader(false);
    }
  };

  const validate = async (value) => {
    const error = {};
    if (value.totalBill !== 0) {
      if (!value.totalBill) {
        error.totalBill = "Total Bill is required!";
      }
    }
    if (value.credit !== 0) {
      if (!value.credit) {
        error.credit = "Credit is required!";
      }
    }
    if (value.discount !== 0) {
      if (!value.discount) {
        error.discount = "Discount is required!";
      }
    }
    if (value.checkOutPayment?.length > 0) {
      value.checkOutPayment.forEach((item) => {
        switch (item.paymentMode) {
          case "CARD":
            if (!item.paidMoney) {
              error.card = "Card Amount is Requird";
            }
            break;
          case "UPI":
            if (!item.paidMoney) {
              error.upi = "Upi Amount is Requird";
            }
            break;
          case "CASH":
            if (!item.paidMoney) {
              error.cash = "Cash Amount is Requird";
            }
            break;
          case "BANK":
            if (!item.paidMoney) {
              error.bank = "Bank Amount is Requird";
            }
            break;
        }
      });
    }
    return error;
  };

  if (!selectedData?.name) {
    return (
      <div className="w-full h-[500px]">
        <LoadingImage />
      </div>
    );
  } else {
    return (
      <form
        className="w-full h-auto bg-white rounded-lg p-5"
        onSubmit={handleSubmit}
      >
        <div className="text-secondary text-xl mb-5">
          Booking ID
          <span className="text-black"> :{selectedData?._id}</span>
        </div>
        <CheckinFormHeading heading="Booking  Details" />

        <div className="flex justify-between mb-5 ">
          <div className="flex flex-col gap-3 w-[250px] ">
            <div className="h-[90px]">
              <div className=" text-textGray mb-2">NAME</div>
              <div className="uppercase">{selectedData.name}</div>
            </div>
            <div>
              <div className=" text-textGray mb-2">ADDRESS</div>
              <div className=" uppercase mb-2">
                <span>{selectedData.address[0].address}</span>,{" "}
                <span>{selectedData.address[0].district}</span>,{" "}
                <span>{selectedData.address[0].state}</span>,{" "}
                <div>{selectedData.address[0].zipcode}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-[250px]">
            <div className="h-[90px]">
              <div className=" text-textGray mb-2 ">ROOMS</div>
              <div className="flex gap-3">
                {selectedData.roomNumber.map((item) => (
                  <div
                    className="w-10 h-10 flex items-center justify-center bg-borderGray rounded cursor-pointer text-sm "
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className=" text-textGray mb-2">MEAL TYPE</div>
              <div className="w-[150px] py-2 h-[40px] bg-white shadow rounded-full flex  justify-around items-center text-secondary">
                {selectedData.mealPlan}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-[90px]">
              <div className=" text-textGray mb-2">CHECKED IN</div>
              <div className="w-[200px] py-2 h-[40px] bg-white shadow rounded-full flex  justify-around items-center">
                <div className="text-sm text-secondary">
                  {moment(selectedData.checkInDate.slice(0, -1)).format(
                    "DD/MM/YYYY"
                  )}
                </div>
                <div className="border border-r-[1px] border-borderGray h-full"></div>
                <div className="text-sm text-secondary">
                  {moment(selectedData.checkInDate.slice(0, -1)).format(
                    "hh:mm A"
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className=" text-textGray mb-2">CHECKED OUT</div>
              <div className="w-[200px] py-2 h-[40px] bg-white shadow rounded-full flex  justify-around items-center">
                <div className="text-sm text-secondary">
                  {moment(selectedData.checkOutDate.slice(0, -1)).format(
                    "DD/MM/YYYY"
                  )}
                </div>
                <div className="border border-r-[1px] border-borderGray h-full"></div>
                <div className="text-sm text-secondary">
                  {moment(selectedData.checkOutDate.slice(0, -1)).format(
                    "hh:mm A"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {selectedData.booking[0].agencyType === "B2B" && (
          <>
            <CheckinFormHeading heading={selectedData.booking[0].agencyType} />

            <div className="flex gap-5 items-center mb-10">
              <div className="text-xl">Agent Name</div>
              <div className="flex items-center justify-center rounded-lg shadow w-auto h-auto px-5 py-2 bg-white text-xl ">
                {selectedData.booking[0].agentName}
              </div>
            </div>
            <div className="flex gap-10 max-xl:gap-5 items-center  mb-10 ">
              <div className="flex-1 flex gap-5 items-center">
                <div className="text-lg">B2B</div>
                <RoundedButton
                  value={
                    selectedData.booking[0].btb === null
                      ? 0
                      : selectedData.booking[0].btb
                  }
                />
              </div>
              <div className="flex-1 flex gap-5 items-center">
                <div className="text-lg">B2C</div>
                <RoundedButton
                  value={
                    selectedData.booking[0].btc === null
                      ? 0
                      : selectedData.booking[0].btc
                  }
                />
              </div>
              <div className="flex-1 flex gap-5 items-center">
                <div className="text-lg">TAC</div>
                <RoundedButton
                  value={
                    selectedData.booking[0].tacamount === null
                      ? 0
                      : selectedData.booking[0].tacamount
                  }
                />
              </div>
            </div>
          </>
        )}
        {selectedData.booking[0].agencyType === "OTA" && (
          <>
            <CheckinFormHeading heading={selectedData.booking[0].agencyType} />

            <div className="flex gap-5 items-center mb-10">
              <div className="text-xl">Platform Name</div>
              <div className="flex items-center justify-center rounded-lg shadow w-auto h-auto px-5 py-2 bg-white text-xl ">
                {selectedData.booking[0].platformName}
              </div>
            </div>
            <div className="flex gap-10 max-xl:gap-5 items-center  mb-10 ">
              <div className="flex-1 flex gap-5 items-center">
                <div className="text-lg">B2B</div>
                <RoundedButton
                  value={
                    selectedData.booking[0].btb === null
                      ? 0
                      : selectedData.booking[0].btb
                  }
                />
              </div>
              <div className="flex-1 flex gap-5 items-center">
                <div className="text-lg">B2C</div>
                <RoundedButton
                  value={
                    selectedData.booking[0].btc === null
                      ? 0
                      : selectedData.booking[0].btc
                  }
                />
              </div>
              <div className="flex-1 flex gap-5 items-center">
                <div className="text-lg">TAC</div>
                <RoundedButton
                  value={
                    selectedData.booking[0].tacamount === null
                      ? 0
                      : selectedData.booking[0].tacamount
                  }
                />
              </div>
            </div>
          </>
        )}
        <CheckinFormHeading heading="Paid Bill" />
        <div className="flex gap-10 max-xl:gap-5 items-center  mb-10 ">
          <div className="flex-1 flex gap-5 items-center">
            <div className="text-lg whitespace-nowrap flex-1">Room Tariff</div>
            <RoundedButton
              flex
              value={selectedData.rmTariff === null ? 0 : selectedData.rmTariff}
            />
          </div>

          <div className="flex-1 flex gap-5 items-center">
            <div className="text-lg flex-1 whitespace-nowrap">Add On Bills</div>
            <RoundedButton flex value={addOnBills} />
          </div>
        </div>
        {reservationPaidMoney !== 0 && (
          <div className=" border border-secondary p-5 rounded-md mb-10">
            <div className="flex  items-center gap-[40px] mb-10">
              <div className="flex gap-8 items-center flex-1">
                <label className="text-lg  whitespace-nowrap">
                  Reservation Paid Amount
                </label>
                <RoundedButton value={reservationPaidMoney + " /-"} />
              </div>
              <div className="flex gap-8 items-center flex-1">
                <label className="text-lg whitespace-nowrap">
                  Reservation In Pay
                </label>
                <RoundedButton
                  value={moment(selectedData?.reservationPaidDate).format(
                    "DD/MM/YYYY"
                  )}
                />
              </div>
            </div>
            <div className="flex gap-10">
              {selectedData?.reservationPayment?.map((item, ind) => {
                return <PaymentModeDisplay key={ind} item={item} />;
              })}
            </div>
          </div>
        )}
        {checkinPaidMoney !== 0 && (
          <div className=" border border-secondary p-5 rounded-md mb-10">
            <div className="flex  items-center gap-[40px] mb-10">
              <div className="flex gap-8 items-center flex-1">
                <label className="text-lg  whitespace-nowrap">
                  Check Paid Amount
                </label>
                <RoundedButton value={checkinPaidMoney + " /-"} />
              </div>
              <div className="flex gap-8 items-center flex-1">
                <label className="text-lg whitespace-nowrap">
                  Chcekin In Pay
                </label>
                <RoundedButton
                  value={moment(selectedData?.checkInPaidDate).format(
                    "DD/MM/YYYY"
                  )}
                />
              </div>
            </div>
            <div className="flex gap-10">
              {selectedData?.checkInPayment?.map((item, ind) => {
                return <PaymentModeDisplay key={ind} item={item} />;
              })}
            </div>
          </div>
        )}
        <div className="flex gap-10 max-xl:gap-5 items-center mb-10">
          <div className="flex-1 flex gap-5 items-center">
            <div className="text-lg whitespace-nowrap flex-1">Total Bill</div>
            <RoundedButton flex value={addOnBills + selectedData?.rmTariff} />
          </div>
          <div className="flex-1 flex gap-5 items-center">
            <div className="text-lg whitespace-nowrap  flex-1">
              Balance To pay
            </div>
            <RoundedButton
              flex
              green
              value={
                addOnBills +
                selectedData?.rmTariff -
                (reservationPaidMoney + checkinPaidMoney)
              }
            />
          </div>
        </div>
        <div className="flex gap-10 mb-10">
          <div className="flex-1 flex flex-col gap-2"></div>
        </div>
        <div className="flex gap-10 mb-10">
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-lg">Discount *</div>
            <CheckInInput
              placeholder={"Enter Discount"}
              type={"number"}
              name="discount"
              error={formError.discount}
              value={values.discount}
              handleChange={handleChange}
            />
            {formError.discount && (
              <FormErrorMessage error={formError.discount} />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-lg">Final BILL *</div>
            <CheckInInput
              placeholder={"Enter Final Bill"}
              disabled={true}
              value={isNaN(total) ? 0 : total}
              name={"finalBill"}
            />
          </div>
        </div>
        <PaymentModeCheckout
          payment={payment}
          setpayment={setPayment}
          formError={formError}
          setPaymentDate={setPaymentDate}
          paymentDate={paymentDate}
        />
        <CheckinFormHeading heading="Credit" />
        <div className="flex-1 flex  gap-10 items-center mb-5">
          <div className="text-lg whitespace-nowrap ">Credit *</div>
          <CheckInInput
            placeholder={"Enter Credit"}
            type={"number"}
            name="credit"
            error={formError.credit}
            value={values.credit}
            handleChange={handleChange}
          />
        </div>
        <div className="flex justify-end mr-2">
          {formError.credit && <FormErrorMessage error={formError.credit} />}
        </div>
        <CheckinFormHeading heading="Remark" />
        <div className="text-lg mb-3">Remarks</div>
        <textarea
          name="remarks"
          id="remarks"
          value={values.remarks}
          onChange={handleChange}
          className="w-full bg-borderGray rounded-xl outline-none px-8 py-5 mb-5"
          placeholder="enter Remarks"
          rows="6"
        />
        <div className="flex items-center flex-col gap-3 ">
          <button
            className={`w-[250px] ${
              !loader && "py-3"
            } text-white text-lg bg-secondary rounded-lg`}
          >
            {loader ? (
              <Spinner color={"#ffffff"} width={"32px"} height={"32px"} />
            ) : (
              "Checkout Now"
            )}
          </button>
          {Object.keys(formError).length !== 0 && (
            <div className="text-red-500">fill all the required field</div>
          )}
        </div>
      </form>
    );
  }
};

export default CheckinConformForm;
