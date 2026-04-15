import {
  ButtonContent,
  Spinner,
  StyledPrimaryButton,
} from "../styles/common.styles";

function ButtonWithLoading({
  isLoading,
  buttonText,
  onAction,
  type = "button",
}) {
  return (
    <div>
      <StyledPrimaryButton disabled={isLoading} onClick={onAction} type={type}>
        {isLoading && (
          <ButtonContent>
            <Spinner viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                opacity="0.25"
              />
              <path
                fill="currentColor"
                opacity="0.75"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </Spinner>
          </ButtonContent>
        )}
        {buttonText ? buttonText : "Submit"}
      </StyledPrimaryButton>
    </div>
  );
}

export default ButtonWithLoading;
