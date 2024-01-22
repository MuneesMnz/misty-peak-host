import React, { useEffect, useState } from "react";
import PageHeading from "../PageHeading";
import PurchaceTable from "./PurchaceTable";
import { userRequset } from "../../api/requestMethods";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import LoadingImage from "../LoadingImage";
import ConformPopUp from "../ConformPopUp";
import { catchError } from "../../api/tokenExpire";
import { useAuthContext } from "../../hooks/useAuthContext";
import ErrorMessage from "../ErrorMessage";
import * as XLSX from "xlsx";
import * as Xlsxpopulate from "xlsx-populate/browser/xlsx-populate";
import HistoryDateSelection from "../BookingPageHeadings/HistoryDateSelection";

const PurchacePage = () => {
  const currentDate = new Date();
  const prevWeekDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 7
  );

  const [purchaceList, setPurchaceList] = useState([]);
  const [popUpOption, setPopUpOption] = useState("");
  const [loader, setLoader] = useState(true);
  const [conformLoader, setConformLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(moment(prevWeekDate).format("DD/MM/YYYY"));
  const [to, setTo] = useState(moment(new Date()).format("DD/MM/YYYY"));
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [popUperror, setPopUpError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const getPurchaceList = async () => {
    setLoader(true);
    try {
      const res = await userRequset.get(`/purchase?from=${from}&to=${to}`);
      setPurchaceList(res.data.data);
      setError("");
      setLoader(false);
    } catch (err) {
      setLoader(false);
      catchError(err, dispatch, setError);
    }
  };

  useEffect(() => {
    getPurchaceList();
  }, [from, to]);

  const ConformModel = (row, option) => {
    console.log(option);
    setPopUpOption(option);
    setOpen(true);
    setId(row);
  };

  const handleConform = () => {
    setConformLoader(true);
    userRequset
      .patch(`/purchase/clearpayment/${id}`)
      .then((res) => {
        console.log(res);
        getPurchaceList();
        setConformLoader(false);
        setOpen(false);
      })
      .catch((err) => {
        setPopUpError("Something went wrong");
        setConformLoader(false);
        console.log(err);
      });
  };

  const handleDelete = () => {
    setConformLoader(true);
    userRequset
      .delete(`/purchase/deletepurchase/${id}`)
      .then((res) => {
        console.log(res);
        getPurchaceList();
        setConformLoader(false);
        setOpen(false);
      })
      .catch((err) => {
        setPopUpError("Something went wrong");
        setConformLoader(false);
        console.log(err);
      });
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "DATE",
        accessor: "dateOfPurachse",
        Cell: ({ value }) => {
          return <div>{moment(value).format("DD/MM/YYYY")}</div>;
        },
      },
      {
        Header: "ITEM",
        accessor: "item",
        Cell: ({ value, cell }) => {
          const otherItem = cell.row.original.otherItem;
          return <div>{value === "Others" ? otherItem : value}</div>;
        },
      },
      {
        Header: "QUANTITY",
        accessor: "quantity",
        Cell: ({ value, cell }) => {
          const unit = cell.row.original.unit;
          return (
            <div className="flex justify-center items-center gap-2">
              <div>{value}</div>
              <div>
                {unit === "Count"
                  ? "no."
                  : unit === "Kilogram"
                  ? "kg"
                  : unit === "Liter"
                  ? "ltr"
                  : ""}
              </div>
            </div>
          );
        },
      },
      {
        Header: "AMOUNT",
        accessor: "amount",
      },
      {
        Header: "PAYMENT",
        accessor: "isPaid",
        Cell: ({ value, cell }) => (
          <div className={`flex justify-evenly`}>
            <div
              className={`w-[70px] h-[25px] text-sm font-[500] flex items-center justify-center rounded-md ${
                value
                  ? "text-green-800 bg-green-200 cursor-default"
                  : "text-red-800 bg-red-200 cursor-pointer"
              } `}
              onClick={() =>
                !value && ConformModel(cell.row.original._id, "payment")
              }
            >
              {value ? "Paid" : "Un Paid"}
            </div>
            <div
              className="w-[70px] h-[25px] text-red-800 bg-red-200  text-sm font-[500] flex items-center justify-center cursor-pointer rounded-md"
              onClick={() => ConformModel(cell.row.original._id, "delete")}
            >
              Delete
            </div>
          </div>
        ),
      },
    ],
    []
  );

  //Exel convert

  const createDownloadData = async () => {
    try {
      const url = await handleReportExel();
      console.log(url);

      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", "purchaceDetailes.xlsx");
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
    let Table = [
      {
        A: "Date",
        B: "Expance",
        C: "Quantity",
        D: "Amount",
        E: "Payment",
      },
    ];

    purchaceList.forEach((item) => {
      Table.push({
        A: moment(item.dateOfPurachse).format("DD/MM/YYYY"),
        B: item.item,
        C: `${item.quantity} ${
          item.unit === "Count"
            ? "no."
            : item.unit === "Kilogram"
            ? "kg"
            : item.unit === "Liter"
            ? "ltr"
            : ""
        }`,
        D: item.amount,
        E: item.isPaid ? "Paid" : "Un Paid",
      });
    });

    const finalData = [{ A: `Purchace Report Detailes` }, {}].concat(Table);

    console.log(finalData);
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
      if (item["A"] === "Date") {
        headerIndex.push(ind);
      }
    });
    //seting alignment for sheet
    const dataInfo = {
      // titleCell: "A2",
      titleRange: "A1:E2",
      tBodyRange: `A3:E${finalData.length}`,
      theadRange:
        headerIndex.length >= 1
          ? `A${headerIndex[0] + 1}:E${headerIndex[0] + 1}`
          : null,
    };

    return addStyles(workbookBlob, dataInfo);
  };
  const addStyles = (workbookBlob, dataInfo) => {
    return Xlsxpopulate.fromDataAsync(workbookBlob)
      .then((workbook) => {
        workbook.sheets().forEach((sheet) => {
          sheet.row(3).height(25);
          sheet.column("A").width(17);
          sheet.column("B").width(23);
          sheet.column("C").width(18);
          sheet.column("D").width(18);
          sheet.column("E").width(18);
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

  // if (!loader) {
  return (
    <>
      <PageHeading heading="purchase" />
      {error === "" ? (
        <>
          <div className="flex justify-between mb-5">
            <div>
              <div className="flex gap-5 items-center ">
                <HistoryDateSelection
                  selected={from}
                  setSelected={setFrom}
                  prev
                />
                <div className="text-2xl font-semibold ">To</div>
                <HistoryDateSelection selected={to} setSelected={setTo} />
              </div>
            </div>
            <button
              onClick={() => navigate("addpurchace")}
              className="mt-5 mb-2 px-5 py-1 bg-white rounded-full w-[100px] text-secondary font-[500]"
            >
              Add
            </button>
          </div>
          {!loader ? (
            <>
              <PurchaceTable data={purchaceList} columns={columns} />
              <div className="mt-10 flex justify-center">
                <button
                  className="w-[230px] h-[50px] text-xl bg-secondary rounded-md text-white "
                  onClick={createDownloadData}
                >
                  View as Report
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-[500px]">
              <LoadingImage />
            </div>
          )}
          {open && (
            <ConformPopUp
              setOpen={setOpen}
              handleConfirm={() =>
                popUpOption === "payment" ? handleConform() : handleDelete()
              }
              loader={conformLoader}
              action={popUpOption === "payment" ? "Paid" : "Delete"}
              setError={setPopUpError}
              error={popUperror}
            />
          )}
        </>
      ) : (
        <ErrorMessage error={error} />
      )}
    </>
  );
};

export default PurchacePage;
