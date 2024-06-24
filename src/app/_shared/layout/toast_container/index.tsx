import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ReactToastContainer = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover={false}
      theme="light"
    />
  );
};
