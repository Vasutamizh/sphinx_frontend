import { createPortal } from "react-dom";
import { Discuss } from "react-loader-spinner";
import { LoaderBackdrop } from "../styles/common.styles";

function Loader() {
  return createPortal(
    <LoaderBackdrop>
      <Discuss
        visible={true}
        height="80"
        width="80"
        ariaLabel="discuss-loading"
        wrapperStyle={{}}
        wrapperClass="discuss-wrapper"
        color="#5B7AB8"
        backgroundColor="#E2F3EE"
      />
    </LoaderBackdrop>,
    document.getElementById("loader-root"),
  );
}

export default Loader;
