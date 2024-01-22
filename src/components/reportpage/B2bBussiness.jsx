import React, { useEffect, useMemo, useState } from "react";
import ReportHeading from "./ReportHeading";
import { userRequset } from "../../api/requestMethods";
import PurchaceTable from "../PurchacePage/PurchaceTable";
import LoadingImage from "../LoadingImage";
import ConformPopUp from "../ConformPopUp";
import { catchError } from "../../api/tokenExpire";
import { useAuthContext } from "../../hooks/useAuthContext";
import ErrorMessage from "../ErrorMessage";

const B2bBussiness = () => {
  const [agentSummery, setAgentSummery] = useState([]);
  const [Loader, setLoader] = useState(true);
  const { dispatch } = useAuthContext();
  const [error, setError] = useState("");
  const [PopUperror, setPopUpError] = useState("");
  const [agentName, setAgentName] = useState("");
  const [open, setOpen] = useState(false);
  const [conformLoader, setconformLoader] = useState(false);

  const getAgentSUmmery = async () => {
    setLoader(true);
    try {
      const res = await userRequset.get("/agents/agentsummery/");
      setAgentSummery(res.data.data);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      catchError(err, dispatch, setError);
    }
  };

  useEffect(() => {
    getAgentSUmmery();
  }, []);

  const openPopupBox = (name) => {
    console.log(name);
    setAgentName(name);
    setOpen(true);
  };

  const clearAgentBalance = async (name) => {
    setconformLoader(true);
    try {
      const res = await userRequset.get(`/agents/clearagentbalnce/${name}`);
      console.log(res.data);
      setconformLoader(false);
      setOpen(false)
      getAgentSUmmery();
      setPopUpError("");
    } catch (err) {
      setconformLoader(false);
      console.log(err);
      setPopUpError("something went wrong");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Agent Type",
        accessor: "agencyType",
      },
      {
        Header: "Agent Name",
        accessor: "agentName",
      },
      {
        Header: "Amount",
        accessor: "sumoftac",
      },
      {
        Header: "Balance",
        accessor: "topay",
      },
      {
        Header: "clear",
        accessor: "",
        Cell: ({ cell }) => {
          const topay = cell.row.original.topay;
          const AgentName = cell.row.original.agentName;
          return (
            <div className="flex items-center justify-center">
              <div
                className={`w-[110px] h-auto px-3 py-1 text-[15px] rounded-lg  ${
                  topay > 0
                    ? "bg-red-200 text-red-800 font-[500] cursor-pointer"
                    : "bg-green-200 text-green-800 font-[500]"
                }`}
                onClick={() => topay > 0 && openPopupBox(AgentName)}
              >
                {topay > 0 ? "Not Paid" : "Paid"}
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="mt-10">
      <ReportHeading heading={"B2B Business"} />
      {Loader ? (
        <LoadingImage />
      ) : error === "" ? (
        <>
          <PurchaceTable columns={columns} data={agentSummery} />
          {open && (
            <ConformPopUp
              setOpen={setOpen}
              handleConfirm={() => clearAgentBalance(agentName)}
              loader={conformLoader}
              error={PopUperror}
              setError={setPopUpError}
              action={"Clear"}
            />
          )}
        </>
      ) : (
        <ErrorMessage error={error} />
      )}
    </div>
  );
};

export default B2bBussiness;
