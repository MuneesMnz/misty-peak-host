import React, { useEffect, useState } from "react";
import PageHeading from "../PageHeading";
import CheckinFormHeading from "./CheckinFormHeading";
import CheckInInput from "./CheckInInput";
import CheckinSelect from "./CheckinSelect";
import "../../App.css";
import MuiDatePicker from "../formElements/MuiDatePicker";
import moment from "moment";
import MuiTimePicker from "../formElements/MuiTimePicker";
import { userRequset } from "../../api/requestMethods";
import { useNavigate, useParams } from "react-router-dom";
import CheckingselectingRoom from "./CheckingselectingRoom";
import BookingTypeRadio from "./BookingTypeRadio";
import BookingTypeComp from "./BookingType";
import PaymentMode from "./PaymentMode";
import LoadingImage from "../LoadingImage";
import FormErrorMessage from "../FormErrorMessage";
import Spinner from "../spinner/Spinner";
import { validate } from "../../utils/checkinValidation";
import ConformPopUp from "../ConformPopUp";
import PaymentModeDisplay from "./PaymentModeDisplay";

const RoundButton = ({ children }) => {
  return (
    <div
      className={`w-[250px] h-[50px] 
             bg-white text-secondary border border-borderGray  
               shadow-md rounded-full flex  justify-around items-center  `}
    >
      {children}
    </div>
  );
};

const Label = ({ label }) => {
  return (
    <label htmlFor="" className="text-lg font-semibold ">
      {label}
    </label>
  );
};

const CheckinForm = ({ conform }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [item, setItem] = useState("");
  const [roomSelect, setRoomSelect] = useState([]);
  const [popupOpen, setPopUpOpen] = useState(false);
  const [payment, setpayment] = useState([]);
  const [loader, setLoader] = useState(false);
  const [checkinDate, setCheckinDate] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [checkOutDate, setCheckOutDate] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [paymentDate, setPaymentDate] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [checkintime, setCheckinTime] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState(new Date());
  const [reservationPaidMoney, setReservationPaidMoney] = useState(0);
  const [selectedData, setSelectedData] = useState({});
  const [TACtype, setTACtype] = useState(false);
  const [paymenttype, setPaymenttype] = useState(false);
  const [bookingType, setBookingType] = useState("");
  const [conformPopUpOpen, setConformPopUpOpen] = useState(false);
  const [bookingTypeRest, setBookingTypeRest] = useState({
    agentName: "",
    platformName: "",
    btb: null,
    btc: null,
    tacisPaid: false,
    tacamount: null,
    tacBalnce: null,
    credit: null,
  });

  const [values, setValues] = useState({
    name: "",
    address: [
      {
        address: "",
        district: "",
        state: "",
        zipcode: "",
      },
    ],
    phoneNumber: "",
    pax: [
      {
        adult: "",
        child: "",
        infant: "",
      },
    ],
    mealPlan: item,
    rmTariff: "",
    roomNumber: [],
    checkInDate: "",
    checkOutDate: "",
    booking: [
      {
        agencyType: "Direct",
        ...bookingTypeRest,
      },
    ],
    checkInPayment: payment,
    checkInPaidDate: "",
    remarks: "",
  });

  const BookingType = ["Direct", "B2B", "Owner's care", "OTA"];

  const getWaitlist = async () => {
    try {
      const responce = await userRequset.get("/book/waitinglist");
      const item = await responce.data.data.data?.find(
        (value) => value._id === id
      );
      setSelectedData(item);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { type, value, name } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleNestedChange = (e, index, filedName, outerFieldName) => {
    const { value, type } = e.target;
    setValues((prev) => {
      if (outerFieldName === "address") {
        const updatedAddress = [...prev.address];
        updatedAddress[index][filedName] =
          type === "number" ? parseInt(value) : value;
        return { ...prev, address: updatedAddress };
      } else if (outerFieldName === "pax") {
        const updatedPax = [...prev.pax];
        updatedPax[index][filedName] =
          type === "number" ? parseInt(value) : value;
        return { ...prev, pax: updatedPax };
      }
    });
  };

  useEffect(() => {
    getWaitlist();
  }, []);
  useEffect(() => {
    if (selectedData && selectedData.address) {
      setValues({
        name: selectedData?.name,
        address: [
          {
            address: selectedData?.address[0]?.address,
            district: selectedData?.address[0]?.district,
            state: selectedData?.address[0]?.state,
            zipcode: selectedData?.address[0]?.zipcode,
          },
        ],
        phoneNumber: selectedData?.phoneNumber,
        pax: [
          {
            adult: selectedData?.pax[0].adult,
            child: selectedData?.pax[0].child,
            infant: selectedData?.pax[0].infant,
          },
        ],
        mealPlan: item,
        rmTariff: selectedData.rmTariff,
        roomNumber: selectedData.roomNumber,
        checkInDate: checkinDate,
        checkOutDate: checkOutDate,
        booking: [
          {
            agencyType: bookingType,
            ...bookingTypeRest,
          },
        ],
        checkInPayment: payment,
        remarks: selectedData.remarks,
      });
      let reservationAdvmoney = selectedData?.reservationPayment.reduce(
        (sum, item) => sum + item.paidMoney,
        0
      );
      setReservationPaidMoney(reservationAdvmoney);
    }
  }, [selectedData]);

  console.log("values", selectedData);

  useEffect(() => {
    setItem(selectedData?.mealPlan);
    if (typeof selectedData.checkInDate === "string") {
      setCheckinDate(selectedData.checkInDate.slice(0, -1));
      const checkinTimeCut = selectedData.checkInDate.slice(0, -1);
      setCheckinTime(new Date(checkinTimeCut));
    }
    if (typeof selectedData.checkOutDate === "string") {
      setCheckOutDate(selectedData.checkOutDate.slice(0, -1));
      const checkinTimeCut = selectedData.checkOutDate.slice(0, -1);
      setCheckOutTime(new Date(checkinTimeCut));
    }
    if (selectedData.booking && selectedData.booking.length > 0) {
      const { booking } = selectedData;
      const first = booking[0];
      let { agencyType, ...rest } = first;
      setBookingType(agencyType);
      setBookingTypeRest(rest);
      setTACtype(rest.tacisPaid);
    }
  }, [selectedData]);
  useEffect(() => {
    setValues((prev) => ({ ...prev, checkInPayment: payment }));
  }, [payment]);

  useEffect(() => {
    const { booking } = values;
    const first = booking[0];
    let { agencyType, ...rest } = first;
    agencyType = bookingType;
    setValues((prev) => ({ ...prev, booking: [{ agencyType, ...rest }] }));
  }, [bookingType]);

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      booking: [{ agencyType: bookingType, ...bookingTypeRest }],
    }));
  }, [bookingTypeRest]);

  const handleClick = async (e) => {
    e.preventDefault();
    setValues((prev) => ({
      ...prev,
      booking: [{ agencyType: bookingType, ...bookingTypeRest }],
    }));
    try {
      setLoader(true);
      const validation = await validate(values);
      setFormError(validation);
      console.log(values);
      if (Object.keys(validation).length === 0) {
        setLoader(true);
        console.log(values);
        userRequset
          .put(`/book/checkin/${id}`, values)
          .then((res) => {
            console.log(res);
            setLoader(false);
            if (conform) {
              setConformPopUpOpen(true);
            } else {
              navigate("/booking/waitlist");
            }
          })
          .catch((err) => {
            console.log(err);
            setLoader(false);
          });
        console.log("success");
      } else {
        console.log("error");
        setLoader(false);
      }
    } catch (err) {
      console.log("Catch error", err);
    }
  };
  const handleConform = async () => {
    try {
      setLoader(true);
      const res = await userRequset.get(`/book/confirm/${selectedData._id}`);
      console.log(res.data);
      setLoader(false);
      setConformPopUpOpen(false);
      navigate("/booking/waitlist");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setValues((prev) => ({ ...prev, roomNumber: roomSelect }));
  }, [roomSelect]);
  useEffect(() => {
    // checkin
    const selectedCheckinDate = new Date(checkinDate);
    const selectedCheckinTime = new Date(checkintime);
    const checkinYear = selectedCheckinDate.getFullYear();
    const checkinMonth = String(selectedCheckinDate.getMonth() + 1).padStart(
      2,
      "0"
    );
    const checkinDay = String(selectedCheckinDate.getDate()).padStart(2, "0");
    const checkinHours = String(selectedCheckinTime.getHours()).padStart(
      2,
      "0"
    );
    const checkinMinutes = String(selectedCheckinTime.getMinutes()).padStart(
      2,
      "0"
    );
    const formattedCheckinDate = `${checkinYear}-${checkinMonth}-${checkinDay}T${checkinHours}:${checkinMinutes}`;

    //checkout
    const selectedCheckoutDate = new Date(checkOutDate);
    const selectedCheckoutTime = new Date(checkOutTime);
    const checkoutYear = selectedCheckoutDate.getFullYear();
    const checkoutMonth = String(selectedCheckoutDate.getMonth() + 1).padStart(
      2,
      "0"
    );
    const checkoutDay = String(selectedCheckoutDate.getDate()).padStart(2, "0");
    const checkoutHours = String(selectedCheckoutTime.getHours()).padStart(
      2,
      "0"
    );
    const checkoutMinutes = String(selectedCheckoutTime.getMinutes()).padStart(
      2,
      "0"
    );
    const formattedCheckoutDate = `${checkoutYear}-${checkoutMonth}-${checkoutDay}T${checkoutHours}:${checkoutMinutes}`;

    //payment Date
    const selectedPaymentDate = new Date(paymentDate);
    const paymentYear = selectedPaymentDate.getFullYear();
    const paymentMonth = String(selectedPaymentDate.getMonth() + 1).padStart(
      2,
      "0"
    );
    const paymentDay = String(selectedPaymentDate.getDate()).padStart(2, "0");

    const formatedPaymentDate = `${paymentYear}-${paymentMonth}-${paymentDay}`;
    setValues((prev) => ({
      ...prev,
      checkInDate: formattedCheckinDate,
      checkOutDate: formattedCheckoutDate,
      checkInPaidDate: paymenttype ? formatedPaymentDate : "",
    }));
  }, [checkinDate, checkOutDate, checkOutTime, checkintime, paymentDate]);
  if (!selectedData?.name) {
    return <LoadingImage />;
  } else {
    return (
      <div>
        <PageHeading heading={"Check In Form"} />
        <div className="w-full h-auto p-10 bg-white rounded-lg mt-10">
          <form onSubmit={handleClick}>
            <CheckinFormHeading heading="CUSTOMER DETAILS" />
            <div className="flex flex-col gap-2 mb-5 ">
              <Label label="Name *" />
              <CheckInInput
                type={"text"}
                placeholder="Enter Full Name"
                name={"name"}
                value={values.name}
                handleChange={handleChange}
                error={formError.name}
              />
              {formError.name && <FormErrorMessage error={formError.name} />}
            </div>
            {values.address.map((item, index) => (
              <div className="flex flex-col gap-2 mb-5 " key={index}>
                <Label label={"Address"} />
                <CheckInInput
                  type="text"
                  placeholder="Line 1"
                  name={`address[${index}].address`}
                  value={item.address}
                  handleChange={(e) =>
                    handleNestedChange(e, index, "address", "address")
                  }
                />
                <div className="flex gap-10 mt-5 ">
                  <div className="flex-1">
                    <CheckInInput
                      type="text"
                      placeholder="district"
                      value={item.district}
                      name={`address[${index}].district`}
                      handleChange={(e) =>
                        handleNestedChange(e, index, "district", "address")
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <CheckInInput
                      type="text"
                      placeholder="state"
                      value={item.state}
                      name={`address[${index}].state`}
                      handleChange={(e) =>
                        handleNestedChange(e, index, "state", "address")
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <CheckInInput
                      type="number"
                      placeholder="zip"
                      value={item.zipcode}
                      name={`address[${index}].zipcode`}
                      handleChange={(e) =>
                        handleNestedChange(e, index, "zipcode", "address")
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2 mb-5 ">
              <Label label={"Phone Number *"} />
              <CheckInInput
                placeholder="Enter Phone Number"
                type="number"
                name={"phoneNumber"}
                value={values.phoneNumber}
                error={formError.phoneNumber}
                handleChange={handleChange}
                phone
              />
              <p className="mt-2 text-end text-sm text-textGray">
                {values.phoneNumber.toString() === "NaN"
                  ? 0
                  : values.phoneNumber.toString().length}
                /10
              </p>
              {formError.phoneNumber && (
                <FormErrorMessage error={formError.phoneNumber} />
              )}
            </div>
            <div className="flex flex-col gap-2 mb-5 ">
              <Label label={"PAX/PAN"} />
              {values.pax?.map((item, index) => (
                <div className="flex  gap-10 mb-5" key={index}>
                  <div className="flex-1 flex items-center gap-5 ">
                    <label className=" whitespace-nowrap">Adult *</label>
                    <div className="flex flex-col">
                      <CheckInInput
                        placeholder="Adult"
                        type={"number"}
                        pax
                        name="adult"
                        value={item.adult}
                        error={formError.adult}
                        handleChange={(e) =>
                          handleNestedChange(e, index, "adult", "pax")
                        }
                      />
                      {formError.adult && (
                        <FormErrorMessage error={formError.adult} />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex items-center  gap-5 ">
                    <label htmlFor="">Child</label>
                    <div className="flex flex-col">
                      <CheckInInput
                        placeholder="Child"
                        type={"number"}
                        pax
                        name="child"
                        value={item.child}
                        error={formError.child}
                        handleChange={(e) =>
                          handleNestedChange(e, index, "child", "pax")
                        }
                      />
                      {formError.child && (
                        <FormErrorMessage error={formError.child} />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex items-center  gap-5">
                    <label htmlFor="">Infant</label>
                    <div className="flex flex-col">
                      <CheckInInput
                        placeholder="Infant"
                        type={"number"}
                        pax
                        name="infant"
                        value={item.infant}
                        error={formError.infant}
                        handleChange={(e) =>
                          handleNestedChange(e, index, "infant", "pax")
                        }
                      />
                      {formError.infant && (
                        <FormErrorMessage error={formError.infant} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CheckinFormHeading heading="Plan & Meals" />
            <div className="flex gap-10 mb-5 items-center">
              <div className="flex-1 flex items-center gap-5 ">
                <label className=" whitespace-nowrap">Meal Plan</label>
                <CheckinSelect
                  data={["CP", "MAP", "EP"]}
                  value={item}
                  setValue={setItem}
                />
              </div>
              <div className="flex-1 flex items-center gap-5 ">
                <label className="whitespace-nowrap">RM Tariff *</label>
                <div className="flex flex-col">
                  <CheckInInput
                    type={"number"}
                    placeholder="rm tharif"
                    handleChange={handleChange}
                    name={"rmTariff"}
                    error={formError.rmTariff}
                    value={values.rmTariff}
                  />
                  {formError.rmTariff && (
                    <FormErrorMessage error={formError.rmTariff} />
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-5  justify-end items-center  ">
                <div className="flex gap-5 flex-wrap">
                  {values?.roomNumber?.map((value, index) => (
                    <div
                      key={index}
                      className="text-white bg-secondary w-12 h-10 flex items-center justify-center rounded-md cursor-pointer "
                    >
                      {value}
                    </div>
                  ))}
                </div>
                <div
                  className="w-[150px] h-[40px] bg-secondary text-white shadowNormal
                rounded-full flex items-center justify-center cursor-pointer"
                >
                  <div onClick={() => setPopUpOpen(true)}>Choose Rooms</div>
                </div>
                {popupOpen && (
                  <CheckingselectingRoom
                    setRoomNumber={setRoomSelect}
                    open={popupOpen}
                    setOpen={setPopUpOpen}
                  />
                )}
              </div>
            </div>
            <CheckinFormHeading heading="Arrival & Departure" />
            <div className="flex flex-col gap-5 ">
              <Label label={"Check In Date & Time"} />
              <div className="flex items-center gap-10 mb-5">
                <div className="flex-1">
                  <MuiDatePicker
                    selected={checkinDate}
                    setSeleceted={setCheckinDate}
                  />
                </div>
                <div className="flex-1">
                  <MuiTimePicker
                    selected={checkintime}
                    setSeleceted={setCheckinTime}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 ">
              <Label label={"Check Out Date & Time"} />
              <div className="flex items-center gap-10 mb-5">
                <div className="flex-1">
                  <MuiDatePicker
                    selected={checkOutDate}
                    setSeleceted={setCheckOutDate}
                  />
                </div>
                <div className="flex-1">
                  <MuiTimePicker
                    selected={checkOutTime}
                    setSeleceted={setCheckOutTime}
                  />
                </div>
              </div>
            </div>
            <CheckinFormHeading heading="Booking Type & Payment" />

            <div className="flex flex-col gap-5 mb-5 ">
              <Label label={"Payment type"} />
              <BookingTypeRadio
                data={BookingType}
                selected={bookingType}
                setSelected={setBookingType}
              />
            </div>
            {bookingType === "OTA" && (
              <BookingTypeComp
                formError={formError}
                values={bookingTypeRest}
                setValues={setBookingTypeRest}
                TACtype={TACtype}
                setTACtype={setTACtype}
              />
            )}
            {bookingType === "B2B" && (
              <BookingTypeComp
                payment
                formError={formError}
                values={bookingTypeRest}
                setValues={setBookingTypeRest}
                TACtype={TACtype}
                setTACtype={setTACtype}
              />
            )}
            <CheckinFormHeading heading="Payment Mode" />
            {reservationPaidMoney !== 0 && (
              <div className=" border border-secondary p-5 rounded-md">
                <div className="flex  items-center gap-[40px] mb-10">
                  <div className="flex gap-8 items-center flex-1">
                    <label className="text-lg">Reservation Paid Amount</label>
                    <RoundButton>{reservationPaidMoney + " /-"}</RoundButton>
                  </div>
                  <div className="flex gap-8 items-center flex-1">
                    <label className="text-lg">Reservation In Pay</label>
                    <RoundButton>
                      {moment(selectedData.reservationPaidDate).format(
                        "DD/MM/YYYY"
                      )}
                    </RoundButton>
                  </div>
                </div>
                <div className="flex gap-10">
                  {selectedData?.reservationPayment?.map((item, ind) => {
                    return <PaymentModeDisplay key={ind} item={item} />;
                  })}
                </div>
              </div>
            )}

            <PaymentMode
              payment={payment}
              setpayment={setpayment}
              formError={formError}
              paymentDate={paymentDate}
              setPaymentDate={setPaymentDate}
              paymenttype={paymenttype}
              setPaymenttype={setPaymenttype}
            />

            <CheckinFormHeading heading="Remarks" />
            <textarea
              name="remarks"
              id="remarks"
              className={`w-full bg-borderGray rounded-xl outline-none px-8 py-5 ${
                formError.remarks && "border border-red-500"
              } `}
              placeholder="enter Remarks"
              rows="5"
              value={values.remarks}
              onChange={handleChange}
            />
            {formError.remarks && (
              <FormErrorMessage error={formError.remarks} />
            )}
            <div className="mt-10 flex items-center flex-col gap-3">
              <button
                type="submit"
                className={`text-lg w-[250px] ${
                  !loader && "py-3"
                } bg-secondary rounded-md text-white`}
              >
                {loader ? (
                  <Spinner color={"#ffffff"} width={"32px"} height={"32px"} />
                ) : conform ? (
                  "Conform Checkin"
                ) : (
                  " Place Checkin"
                )}
              </button>

              {Object.keys(formError).length !== 0 && (
                <div className="text-red-500">fill all the required field</div>
              )}
            </div>
          </form>
        </div>
        {conformPopUpOpen && (
          <ConformPopUp
            setOpen={setConformPopUpOpen}
            handleConfirm={handleConform}
            loader={loader}
            action={" Confirm"}
            // error={popUpError}
            // setError={setPopUpError}
          />
        )}
      </div>
    );
  }
};

export default CheckinForm;
