import React, { useState } from "react";
import { apiGetFile } from "../../hooks/useAPI";

function Certificate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const examId = "EX1";
  const partyId = "1001";

 
  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiGetFile(
        `/certificate/download?examId=${examId}&partyId=${partyId}`,
      );

      if (!result) {
        setError("Failed to download certificate");
        return;
      }

      const url = window.URL.createObjectURL(result.blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename || "certificate.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const handleView = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiGetFile(
        `/certificate/download?examId=${examId}&partyId=${partyId}`,
      );

      if (!result) {
        setError("Failed to load certificate");
        return;
      }

      const url = window.URL.createObjectURL(result.blob);
      window.open(url);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎓 Certificate</h2>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.buttonContainer}>
        <button onClick={handleView} disabled={loading} style={styles.button}>
          {loading ? "Loading..." : "View Certificate"}
        </button>

        <button
          onClick={handleDownload}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Loading..." : "Download Certificate"}
        </button>
      </div>
    </div>
  );
}

export default Certificate;
