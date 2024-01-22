import React, { useEffect, useMemo, useState } from "react";
import PageHeading from "../PageHeading";
import { userRequset } from "../../api/requestMethods";
import LoadingImage from "../LoadingImage";
import PurchaceTable from "../PurchacePage/PurchaceTable";
import ConformPopUp from "../ConformPopUp";
import { useNavigate } from "react-router-dom";
import { catchError } from "../../api/tokenExpire";
import { useAuthContext } from "../../hooks/useAuthContext";
import ErrorMessage from "../ErrorMessage";

const User = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [ConformLoader, setConformLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [PopUperror, setPopUpError] = useState("");
  const { dispatch } = useAuthContext();
  const getUser = async () => {
    try {
      const res = await userRequset.get("/user");
      setUserData(res.data.data.users);
      setLoader(true);
      setError("");
    } catch (err) {
      setLoader(true)
      catchError(err, dispatch, setError);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const HandleDeleteUser = (id) => {
    console.log(id);
    setConformLoader(true);
    setOpen(false);
    setLoader(false);
    userRequset
      .delete(`/user/${id}`)
      .then((res) => {
        console.log(res.data);
        setConformLoader(false);
        getUser();
      })
      .catch((err) => {
        // setLoader(false)
        console.log(err);
      });
  };

  const column = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Gmail",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Action",
        accessor: "_id",
        Cell: ({ value }) => (
          <div className="flex items-center justify-center">
            <div
              className="bg-red-200 text-red-800 font-[500] text-[15px] w-[100px] rounded-md h-[30px] cursor-pointer  "
              onClick={() => {
                setId(value);
                setOpen(true);
              }}
            >
              Delete
            </div>
          </div>
        ),
      },
    ],
    []
  );
  return (
    <>
      <div className="relative">
        <PageHeading heading={"User"} />
        <div
          className="absolute top-3 right-5 w-auto h-auto px-4 py-1.5 text-white bg-secondary font-[500] text-lg rounded-md cursor-pointer "
          onClick={() => navigate("adduser")}
        >
          Add User
        </div>
      </div>
      {Loader ? (
        error === "" ? (
          <PurchaceTable columns={column} data={userData} />
        ) : (
          <ErrorMessage error={error} />
        )
      ) : (
        <LoadingImage />
      )}
      {open && (
        <ConformPopUp
          setOpen={setOpen}
          handleConfirm={() => HandleDeleteUser(id)}
          loader={ConformLoader}
        />
      )}
    </>
  );
};

export default User;
