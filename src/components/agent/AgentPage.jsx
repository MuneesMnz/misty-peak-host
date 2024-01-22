import React, { useEffect, useMemo, useState } from "react";
import PageHeading from "../PageHeading";
import { userRequset } from "../../api/requestMethods";
import PurchaceTable from "../PurchacePage/PurchaceTable";
import { useNavigate } from "react-router-dom";
import LoadingImage from "../LoadingImage";
import { catchError } from "../../api/tokenExpire";
import { useAuthContext } from "../../hooks/useAuthContext";
import ErrorMessage from "../ErrorMessage";

const AgentPage = () => {
  const [agent, setAgent] = useState([]);
  const [Loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();
  const column = useMemo(() => [
    {
      Header: "Name",
      accessor: "agentName",
    },
    {
      Header: "Email ID",
      accessor: "email",
    },
    {
      Header: "User Type",
      accessor: "agencyType",
    },
    {
      Header: "Number",
      accessor: "agentNumber",
    },
  ]);

  const getAgents = async () => {
    try {
      const responce = await userRequset.get("/agents");
      //   console.log(responce.data.data);
      setAgent(responce.data.data);
      setLoader(true);
    } catch (err) {
      setLoader(true);
      catchError(err, dispatch, setError);
    }
  };

  useEffect(() => {
    getAgents();
  }, []);
  return (
    <div className="relative">
      <PageHeading heading={"Agents"} />
      {Loader ? (
        error === "" ? (
          <PurchaceTable columns={column} data={agent} />
        ) : (
          <ErrorMessage error={error} />
        )
      ) : (
        <LoadingImage />
      )}

      <div className="absolute top-1.5 right-0 ">
        <button
          className="text-lg bg-secondary text-white px-5 py-2 rounded-lg"
          onClick={() => navigate("addagent")}
        >
          Add Agent
        </button>
      </div>
    </div>
  );
};

export default AgentPage;
