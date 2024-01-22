export const validate = async (value) => {
    const error = {};
    if (!value.name) {
      error.name = "Name is required!";
    } else if (value.name.length < 4) {
      error.name = "Name must have 4 digits!";
    }
    if (!value.phoneNumber) {
      error.phoneNumber = "PhoneNumber is required!";
    } else if (value.phoneNumber.length < 10) {
      error.phoneNumber = "PhoneNumber must have 10 digits!";
    }
    if (value.pax[0].adult !== 0) {
      if (!value.pax[0].adult) {
        error.adult = "Adult is required!";
      } else if (value.pax[0].adult <= 0) {
        error.adult = "Invalid Number!";
      }
    }
    if (!value.rmTariff) {
      error.rmTariff = "Room Tariff is required!";
    }
    if (!value.mealPlan) {
      error.mealPlan = "Meal Plan is required!";
    }
    if (value.roomNumber.length === 0) {
      error.roomNumber = "Select Any Room!";
    }
    if (value.roomNumber.length === 0) {
      error.roomNumber = "Select Any Room!";
    }
    value.booking.forEach((bookingItem, index) => {
      if (bookingItem?.agencyType === "OTA") {
        if (!bookingItem?.platformName) {
          if (!error.booking) {
            error.booking = [];
          }
          if (!error.booking[index]) {
            error.booking[index] = {};
          }
          error.booking[index].platformName = "Platform Name is required!";
        }
        if (!bookingItem?.btb) {
          if (!error.booking) {
            error.booking = [];
          }
          if (!error.booking[index]) {
            error.booking[index] = {};
          }
          error.booking[index].btb = "B2B is required!";
        }
        if (!bookingItem?.btc) {
          if (!error.booking) {
            error.booking = [];
          }
          if (!error.booking[index]) {
            error.booking[index] = {};
          }
          error.booking[index].btc = "B2C  is required!";
        }
        if (bookingItem.tacisPaid === true) {
          if (!bookingItem?.tacBalnce) {
            if (!error.booking) {
              error.booking = [];
            }
            if (!error.booking[index]) {
              error.booking[index] = {};
            }
            error.booking[index].tacBalnce = "tac Balnce  is required!";
          }
          if (!bookingItem?.tacamount) {
            if (!error.booking) {
              error.booking = [];
            }
            if (!error.booking[index]) {
              error.booking[index] = {};
            }
            error.booking[index].tacamount = "tacamount  is required!";
          }
        }
      }
      if (bookingItem?.agencyType === "B2B") {
        if (!bookingItem?.agentName) {
          if (!error.booking) {
            error.booking = [];
          }
          if (!error.booking[index]) {
            error.booking[index] = {};
          }
          error.booking[index].agentName = "Agent Name is required!";
        }
        if (!bookingItem?.btb) {
          if (!error.booking) {
            error.booking = [];
          }
          if (!error.booking[index]) {
            error.booking[index] = {};
          }
          error.booking[index].btb = "B2B is required!";
        }
        if (!bookingItem?.btc) {
          if (!error.booking) {
            error.booking = [];
          }
          if (!error.booking[index]) {
            error.booking[index] = {};
          }
          error.booking[index].btc = "B2C  is required!";
        }
        if (bookingItem.tacisPaid === true) {
          if (!bookingItem?.tacBalnce) {
            if (!error.booking) {
              error.booking = [];
            }
            if (!error.booking[index]) {
              error.booking[index] = {};
            }
            error.booking[index].tacBalnce = "tac Balnce  is required!";
          }
          if (!bookingItem?.tacamount) {
            if (!error.booking) {
              error.booking = [];
            }
            if (!error.booking[index]) {
              error.booking[index] = {};
            }
            error.booking[index].tacamount = "tacamount  is required!";
          }
        }
      }
      if (value.reservationPayment.length > 0) {
        value.reservationPayment.forEach((item) => {
          switch (item.paymentMode) {
            case "CARD":
              if (!item.paidMoney) {
                error.card = "Card Amount is Requird!";
              }
              break;
            case "UPI":
              if (!item.paidMoney) {
                error.upi = "Upi Amount is Requird!";
              }
              break;
            case "CASH":
              if (!item.paidMoney) {
                error.cash = "Cash Amount is Requird!";
              }
              break;
            case "BANK":
              if (!item.paidMoney) {
                error.bank = "Bank Amount is Requird!";
              }
              break;
          }
        });
      }
    });
    return error;
  };
