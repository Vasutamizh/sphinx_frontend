import { Link } from "react-router-dom";
import styled from "styled-components";

export const TextInput = styled.input`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  box-shadow: none;
  border: 1px solid #ced6e0;
  font-size: 18px;
  padding: 5px 15px;
  background: none;
  color: #15314d;
  font-family: "Source Sans Pro", sans-serif;
  outline: none;
`;

export const StyledLink = styled(Link)`
  color: var(--primary-color);
  font-weight: 600;
`;

export const ErrorBox = styled.div`
  max-width: 350px;
  background-color: #fdecea;
  color: #b71c1c;

  border: 1px solid #f5c2c7;
  border-left: 5px solid #d32f2f;

  padding: 14px 16px;
  border-radius: 8px;

  font-size: 14px;
  font-weight: 500;

  margin: 12px auto;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const MandatoryInp = styled.span`
  content: "*";
  font-size: 18px;
  color: red;
  font-weight: 700;
`;

export const FormErrorMessage = styled.span`
  color: #d93025;
  background-color: #fdecea;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  margin-top: 4px;
`;

export const FormDiv = styled.div`
  max-width: 500px;
`;
