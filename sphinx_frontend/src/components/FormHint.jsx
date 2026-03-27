import { HintBox, HintIcon, HintText } from "../styles/FormHint.styles";

export default function FormHint({ children }) {
  return (
    <HintBox>
      <HintIcon>💡</HintIcon>
      <HintText>{children}</HintText>
    </HintBox>
  );
}
