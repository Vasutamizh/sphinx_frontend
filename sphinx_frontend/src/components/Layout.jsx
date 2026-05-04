import { Container } from "@mantine/core";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
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
    <div>
      {isLoading && <CustomLoader />}
      <Navbar />
      <Toaster />
      <Container size="xl" my="xl">
        {children}
      </Container>
      <Footer />
    </div>
  );
}

export default Layout;
