import { toast } from "sonner";

export const successToast = (msg) => {
  toast.success(msg || "Action Successful!", { position: "bottom-right" });
};

export const failureToast = (msg) => {
  toast.error(msg || "Action Failed!", { position: "bottom-right" });
};
