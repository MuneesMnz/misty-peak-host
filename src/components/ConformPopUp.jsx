import Spinner from "./spinner/Spinner";

const Button = ({ value, green, handleClick, loader }) => {
  return (
    <div
      onClick={handleClick}
      className={`w-[130px] h-[35px] ${
        green ? "bg-secondary" : "bg-black"
      }   rounded-full text-white flex justify-center items-center cursor-pointer `}
    >
      {green && loader === true ? (
        <Spinner color={"#ffffff"} width={"24px"} height={"24px"} />
      ) : (
        value
      )}
    </div>
  );
};
const ConformPopUp = ({
  setOpen,
  handleConfirm,
  loader,
  action,
  error,
  setError,
}) => {
  return (
    <div className="fixed w-full h-screen bg-gray-600/60 top-0 left-0 z-[100] flex justify-center items-center">
      <div className="w-[450px] h-[250px] bg-white rounded-lg py-12 px-8 shadow-sm flex justify-center items-center">
       <div>
       <div className="text-xl text-center font-[500] mb-10">
          Are You Sure Want To <span className="capitalize">{action}</span> ?
        </div>
        <div className="flex justify-center items-center gap-5">
          <Button
            value="CANCEL"
            handleClick={() => {
              setOpen(false);
              setError("");
            }}
          />
          <Button
            value="CONFIRM"
            green
            handleClick={handleConfirm}
            loader={loader}
          />
        </div>
        {error && (
          <div className="w-full flex justify-center text-red-500 mt-5">
            {error}
          </div>
        )}
       </div>
      </div>
    </div>
  );
};

export default ConformPopUp;
