import { useSelector } from "react-redux";
import {
  BottomBar,
  FooterContainer,
  FooterContent,
  FooterLink,
  FooterSection,
  FooterTitle,
} from "../styles/Footer.styles";

function Footer() {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Sphinx</FooterTitle>
          <p>Smart exam and question management system.</p>
        </FooterSection>

        {isAuthenticated && (
          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink>Dashboard</FooterLink>
            <FooterLink>Question Bank</FooterLink>
            <FooterLink>Create Exam</FooterLink>
          </FooterSection>
        )}

        <FooterSection>
          <FooterTitle>Support</FooterTitle>
          <FooterLink>Help Center</FooterLink>
          <FooterLink>Contact</FooterLink>
          <FooterLink>Report Issue</FooterLink>
        </FooterSection>
      </FooterContent>

      <BottomBar>
        © {new Date().getFullYear()} Sphinx. All rights reserved.
      </BottomBar>
    </FooterContainer>
  );
}

export default Footer;
