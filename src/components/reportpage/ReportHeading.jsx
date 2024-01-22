import moment from "moment";
import React, { useState } from "react";
import { BsCalendarDate, BsFillCaretDownFill } from "react-icons/bs";
import HistoryDateSelection from "../BookingPageHeadings/HistoryDateSelection";
import { useAuthContext } from "../../hooks/useAuthContext";
import * as XLSX from "xlsx";
import * as Xlsxpopulate from "xlsx-populate/browser/xlsx-populate";
import DayDropDown from "./DayDropDown";

const ReportHeading = ({ heading, sales, setFrom, from, to, setTo, data }) => {
  const { user } = useAuthContext();
  const role = user.user.role;
  const createDownloadData = async () => {
    try {
      const url = await handleReportExel();
      console.log(url);

      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", "reportDetailes.xlsx");
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error(error);
    }
  };

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      type: "binary",
    };
    const wbout = XLSX.write(workbook, wopts);

    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });
    return blob;
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }
    return buf;
  };

  const handleReportExel = () => {
    //table Heading
    let table = [
      {
        A: "No",
        B: "Check In",
        C: "Check Out",
        D: "GUEST NAME",
        E: "Room No",
        F: "B2B",
        G: "B2C",
        H: "Agent",
        I: "Food Bill",
        J: "Total (B2B +Food Bill)",
        K: "CASH",
        L: "CARD",
        M: "BANK",
        N: "UPI",
        O: "TAC",
        P: "Credit",
        Q: "Remarks",
      },
    ];

    //merging table body to table
    data.forEach((item, index) => {
      table.push({
        A: index + 1,
        B: moment(item.checkInDate).format("DD/MM/YYYY"),
        C: moment(item.checkOutDate).format("DD/MM/YYYY"),
        D: item.name,
        E: item.roomNumber.join(","),
        F: item.booking[0].btb === null ? 0 : item.booking[0].btb,
        G: item.booking[0].btc === null ? 0 : item.booking[0].btc,
        H: item.booking[0].agentName,
        I: item.addOns?.reduce((total, addon) => total + addon.amount, 0),
        J:
          item.addOns?.reduce((total, addon) => total + addon.amount, 0) +
          (item.booking[0].btb === null ? 0 : item.booking[0].btb),
        K: item.payment
          .filter((ite) => ite.paymentMode === "CASH")
          .map((value) => value.paidMoney)
          .reduce((total, amount) => total + amount, 0),
        L: item.payment
          .filter((ite) => ite.paymentMode === "CARD")
          .map((value) => value.paidMoney)
          .reduce((total, amount) => total + amount, 0),
        M: item.payment
          .filter((ite) => ite.paymentMode === "BANK")
          .map((value) => value.paidMoney)
          .reduce((total, amount) => total + amount, 0),
        N: item.payment
          .filter((ite) => ite.paymentMode === "UPI")
          .map((value) => value.paidMoney)
          .reduce((total, amount) => total + amount, 0),
        O: item.booking[0].tacamount === null ? 0 : item.booking[0].tacamount,
        P: item.booking[0].credit === null ? 0 : item.booking[0].credit,
        Q: item.remarks,
      });
    });

    //merging table title and data
    const finalData = [
      { A: `Report Detailes between ${from} to ${to}` },
      {},
    ].concat(table);

    //create workbook
    const wb = XLSX.utils.book_new();

    // create a work sheet
    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, sheet, "report");

    const workbookBlob = workbook2blob(wb);
    const headerIndex = [];
    finalData.forEach((item, ind) => {
      if (item["A"] === "No") {
        headerIndex.push(ind);
      }
    });

    //seting alignment for sheet
    const dataInfo = {
      titleCell: "A2",
      titleRange: "A1:Q2",
      tBodyRange: `A3:Q${finalData.length}`,
      theadRange:
        headerIndex.length >= 1
          ? `A${headerIndex[0] + 1}:Q${headerIndex[0] + 1}`
          : null,
    };

    return addStyles(workbookBlob, dataInfo);
  };

  //adding some styles and merging columns for the sheet
  const addStyles = (workbookBlob, dataInfo) => {
    return Xlsxpopulate.fromDataAsync(workbookBlob)
      .then((workbook) => {
        workbook.sheets().forEach((sheet) => {
          sheet.row(3).height(25);
          sheet.column("A").width(15);
          sheet.column("B").width(18);
          sheet.column("C").width(18);
          sheet.column("D").width(20);
          sheet.column("E").width(13);
          sheet.column("F").width(12);
          sheet.column("G").width(12);
          sheet.column("H").width(15);
          sheet.column("I").width(13);
          sheet.column("J").width(18);
          sheet.column("K").width(13);
          sheet.column("L").width(13);
          sheet.column("M").width(13);
          sheet.column("N").width(13);
          sheet.column("O").width(13);
          sheet.column("P").width(13);
          sheet.column("Q").width(25);
          sheet.range(dataInfo.titleRange).merged(true).style({
            bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
          });
          sheet.range(dataInfo.tBodyRange).style({
            horizontalAlignment: "center",
            verticalAlignment: "center",
          });
          sheet.range(dataInfo.theadRange).style({
            fill: "007942",
            fontColor: "ffffff",
            bold: true,
          });
        });

        return workbook
          .outputAsync()
          .then((workbookblob) => URL.createObjectURL(workbookblob));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex justify-between items-center mb-10">
      <div className="flex flex-col gap-2 ">
        <div className="text-3xl text-secondary font-[500]">{heading}</div>
      </div>
      <div className="flex gap-10 max-xl:gap-2 max-xl:flex-col items-center">
        {sales && role === "admin" && (
          <div className="flex gap-5 items-center">
            <HistoryDateSelection selected={from} setSelected={setFrom} prev />
            <div className="text-2xl font-semibold ">To</div>
            <HistoryDateSelection selected={to} setSelected={setTo} />
          </div>
        )}
        <button
          className="px-8 py-3 max-xl:w-[250px] text-lg bg-secondary text-white rounded-full"
          onClick={() => {
            if (sales) {
              if (data.length > 0) {
                createDownloadData();
              } else {
                alert("No data Available");
              }
            }
          }}
        >
          Download as Report
        </button>

        {sales && role === "gm" && <DayDropDown setFrom={setFrom} />}
      </div>
    </div>
  );
};

export default ReportHeading;
