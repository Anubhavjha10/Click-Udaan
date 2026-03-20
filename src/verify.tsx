import React, { useState } from "react";
import styles from "./verification.module.css";

type Certificate = {
  id: string;
  name: string;
  email: string;
  course: string;
  duration: string;
  issueDate: string;
  college: string;
  organization: string;
};

const dummyData: Certificate[] = [
  {
    id: "CU-WD-2026-076",
    name: "Simran",
    email: "rajputsimran2428@gmail.com",
    course: "Web Development Internship",
    duration: "2 Months",
    issueDate: "01 March 2026",
    college: "IB College Panipat",
    organization: "ClickUdaan (By Vabit Digify Media Pvt Ltd)",
  },
  {
    id: "CU-WD-2026-077",
    name: "Rahul Sharma",
    email: "n2428@gmail.com",
    course: "Digital Marketing Internship",
    duration: "3 Months",
    issueDate: "15 Feb 2026",
    college: "IB College Panipat",
    organization: "ClickUdaan",
  },
];

const CertificateVerification = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Certificate | null>(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const found = dummyData.find(
      (item) => item.id.toLowerCase() === input.toLowerCase()
    );

    if (found) {
      setResult(found);
      setError("");
    } else {
      setResult(null);
      setError("Certificate not found ❌");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>Certificate Verification</h1>
        <p>
          Enter your Certificate ID to verify authenticity of your certificate.
        </p>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Enter Certificate ID (e.g. CU-2026-001)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSearch}>Verify</button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {result && (
          <div className={styles.resultCard}>
            <h2>Certificate Verified</h2>

            <div className={styles.detail}>
              <strong>Name:</strong> {result.name}
            </div>
            <div className={styles.detail}>
              <strong>Course:</strong> {result.course}
            </div>
            <div className={styles.detail}>
              <strong>Duration:</strong> {result.duration}
            </div>
            <div className={styles.detail}>
              <strong>Issue Date:</strong> {result.issueDate}
            </div>
            <div className={styles.detail}>
              <strong>Issued By:</strong> {result.organization}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerification;