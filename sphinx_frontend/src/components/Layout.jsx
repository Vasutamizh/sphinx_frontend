import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import { LayoutContainer } from "../styles/common.styles";
import Footer from "./Footer";
import CustomLoader from "./Loader";
import Navbar from "./Navbar";

function Layout({ children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const isLoading = useSelector((state) => state.loader?.isLoading);
  // const memoizedComps = useMemo(() => {
  //   return <LayoutContentContainer>{children}</LayoutContentContainer>;
  // }, [children]);
  // console.log("Children => ", children);
  return (
    <LayoutContainer>
      {isLoading && <CustomLoader />}
      <Navbar />
      <Toaster />
      <div className="mt-3">{children}</div>
      <Footer />
    </LayoutContainer>
  );
}

export default Layout;
