import { LoaderCircle } from "lucide-react";
import { createPortal } from "react-dom";
import { LoaderBackdrop } from "../styles/common.styles";

function CustomLoader() {
  return createPortal(
    <LoaderBackdrop>
      <LoaderCircle size={25} className="animate-spin" />
    </LoaderBackdrop>,
    document.getElementById("loader-root"),
  );
}

export default CustomLoader;
