import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { FormErrorMessage } from "../../styles/common.styles";
import Modal from "../Modal";

function SecurityCodeModal({ isOpen, onClose, onOk, type = "warning" }) {
  const inputs = useRef([]);
  const [formError, setFormError] = useState();
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!value.trim() || !/^\d$/.test(value)) {
      e.target.value = "";
      return;
    }

    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerifyCode = () => {
    if (inputs.length < 6) return;
    let code = "";
    for (let ref of inputs.current) {
      code = code + ref.value;
    }
    if (!code || code.length < 6) {
      setFormError("6 digits Code needed!");
      return;
    }

    onOk(code);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Security Code Needed!"}
      subtitle={"Security Code Needed for Security!"}
      type={type}
      size={"40%"}
    >
      <div className="text-center flex flex-col items-center">
        <span className="font-bold text-md">
          Enter the 6 digit Security Code sent to your registered email to
          securely start your assessment.
        </span>
        <div className="otpBox">
          <label class="margin-align">Enter the Code</label>
          <div class="flex gap-3 my-5">
            {[0, 1, 2, 3, 5, 6].map((_, i) => (
              <input
                key={i}
                maxLength={1}
                ref={(el) => (inputs.current[i] = el)}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onBlur={() => setFormError("")}
                style={{ width: 40, height: 40, textAlign: "center" }}
                className="border border-gray-500 rounded"
              />
            ))}
          </div>
          <div className="my-5">
            {formError && <FormErrorMessage>{formError}</FormErrorMessage>}
          </div>

          <Button size="lg" type="button" onClick={handleVerifyCode}>
            Verify Security Code
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default SecurityCodeModal;
