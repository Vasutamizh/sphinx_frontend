import { Toaster } from "sonner";
import {
  LayoutContainer,
  LayoutContentContainer,
} from "../styles/common.styles";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <LayoutContainer>
      <Navbar />
      <Toaster />
      <LayoutContentContainer>{children}</LayoutContentContainer>
      <Footer />
    </LayoutContainer>
  );
}

export default Layout;
