export const catchError = (error, dispatch, setError) => {
  if (error.response && error.response.data) {
    if (
      error.response.data.message === "jwt expired" ||
      error.response.data.status === 401
    ) {
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
    }
    if (
      error.response.data.status === 500 ||
      error.response.data.status === 404
    ) {
      setError("Something Went Wrong");
    }
  } else {
    setError("Something Went Wrong");
  }
};
