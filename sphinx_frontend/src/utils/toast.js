import { toast } from "sonner";

export const successToast = (msg) => {
  toast.success(msg || "Action Successful!", {
    position: "top-right",
    style: {
      background: "#28a745",
      color: "white",
      border: "none",
      marginTop: "45px",
    },
  });
};

export const failureToast = (msg) => {
  toast.error(msg || "Action Failed!", {
    position: "top-right",
    style: {
      background: "#F54927",
      color: "white",
      border: "none",
      marginTop: "45px",
    },
  });
};
