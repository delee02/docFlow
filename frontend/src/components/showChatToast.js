import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showChatToast = (message) => {
  toast(
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
        {message.senderName}
      </span>
      <span style={{ fontSize: "14px", lineHeight: "1.3" }}>
        {message.content}
      </span>
    </div>,
    {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      type: "default",
      style: {
        background: "#b2c5e0ff",
        color: "#000",
        borderRadius: "12px",
        padding: "10px 14px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        maxWidth: "300px",
        wordBreak: "break-word",
      },
    }
  );
};
