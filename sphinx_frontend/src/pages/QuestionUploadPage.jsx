import { useState } from "react";
import { toast } from "sonner";
import FileCard from "../components/FileCard";
import FileUpload from "../components/FileUpload";
import FormHint from "../components/FormHint";
import Loader from "../components/Loader";
import { apiFileGet, apiFilePost } from "../services/ApiService";
import { FormErrorMessage, StyledButton } from "../styles/common.styles";

const QuestionUploadPage = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const downloadTemplate = async () => {
    setIsLoading(true);
    const response = await apiFileGet("/questions/downloadTemplate");

    // here we do this, becuase the file comes as blob and we are manually trigger the downlaod here.
    const url = window.URL.createObjectURL(response);

    const a = document.createElement("a");
    a.href = url;
    a.download = "questions_template.xlsx"; // important
    document.body.appendChild(a);
    a.click();
    a.remove();
    setIsLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log("file", file);

    setError("");

    if (!file) return;

    if (!file.name.endsWith(".xlsx")) {
      setError("Only .xlsx file are allowed!");
      return;
    }

    // size get in bytes
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 2) {
      setError("File size limit exceeds! Max file size 2 Mb.");
      return;
    }

    setFile(file);
  };

  const uploadFile = async () => {
    setIsLoading(true);
    const formData = new FormData();
    if (!file && !(file instanceof File)) {
      setError("File not present, Please re upload.");
      return;
    }
    formData.append("file", file);

    console.log("File type:", typeof file, file instanceof File, file); // must show File object

    const response = await apiFilePost("/questions/upload", formData);
    setIsLoading(false);
    if (response.responseMessage && response.responseMessage === "success") {
      toast.success(response.successMessage, { position: "top-right" });
      setFile(null);
    } else {
      toast.error(response.errorMessage, { position: "top-right" });
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex justify-between items-center">
        <h1>Excel Upload</h1>
        <StyledButton onClick={downloadTemplate}>
          Download Sample Template
        </StyledButton>
      </div>

      <FormHint>
        <strong>Tip -</strong> Click the Download Sample Template to download
        the sample template for questions.
      </FormHint>

      {file && (
        <div>
          <FileCard file={file} onUpload={uploadFile} />
        </div>
      )}
      <div className="mt-20 w-full flex justify-center">
        <FileUpload onFileUpload={handleFileUpload} />
      </div>

      {error && (
        <div className="text-center">
          <FormErrorMessage>{error}</FormErrorMessage>
        </div>
      )}
    </div>
  );
};

export default QuestionUploadPage;
