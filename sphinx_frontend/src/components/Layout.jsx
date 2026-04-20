import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import {
  LayoutContainer,
  LayoutContentContainer,
} from "../styles/common.styles";
import Footer from "./Footer";
import CustomLoader from "./Loader";
import Navbar from "./Navbar";

function Layout({ children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const isLoading = useSelector((state) => state.loader?.isLoading);
  const memoizedComps = useMemo(() => {
    return <LayoutContentContainer>{children}</LayoutContentContainer>;
  }, [children]);
  // console.log("Children => ", children);
  return (
    <LayoutContainer>
      {isLoading && <CustomLoader />}
      <Navbar />
      <Toaster />
      {/* <div className="mt-5 grid gap-3 grid-cols-[1fr_10fr]"> */}
      <div className="mx-30 mt-3">
        {/* <div className="mt-3 flex justify-end">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={20} />{" "}
            <span className="font-semibold text-md">Back</span>
          </Button>
        </div> */}
        {memoizedComps}
      </div>
      <Footer />
    </LayoutContainer>
  );
}

export default Layout;
