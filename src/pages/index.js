import { useState } from "react";

export default function Home() {
  const [answers, setAnswers] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");

  const questions = [
    {
      id: 1,
      text: "1. What is a container?",
      options: [
        "A. A special method of designing more efficient code",
        "B. A digital platform designed to store files developed in different operating systems",
        "C. A standard unit of software that packages code and all its dependencies",
        "D. A data center server that stores cloud files",
      ],
    },
    {
      id: 2,
      text: "2. What are some of the traits of containers?",
      options: [
        "A. Containers save both time and money at the expense of utilization and automation",
        "B. Containers lower costs, but add time",
        "C. Containers are more expensive but save time during deployment",
        "D. Containers save both time and money and improve utilization",
      ],
    },
    {
      id: 3,
      text: "3. You have a Docker container named 'database' running a database server. You want to view all the mapped ports for this container. Which command should you use?",
      options: [
        "A. docker port database",
        "B. docker port database all",
        "C. docker port database 0.0.0.0",
        "D. docker port database *",
      ],
    },
    {
      id: 4,
      text: "4. What is the purpose of the VOLUME instruction in a Dockerfile?",
      options: [
        "A. To specify the ports on which a container listens for connections",
        "B. To add metadata and annotations to the Docker image",
        "C. To expose any database storage area or user-serviceable parts of the image",
        "D. To set the working directory for commands executed during the Docker build process",
      ],
    },
  ];

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitStatus("Submitting...");
      console.log("Submitting answers:", answers);

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      console.log("Submission Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit answers");
      }

      setSubmitStatus("Answers submitted successfully!");
    } catch (error) {
      console.error("Error submitting answers:", error);
      setSubmitStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        CSC309 Lab10 Quiz
      </h1>
      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "20px" }}>{q.text}</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(q.id, opt)}
                style={{
                  padding: "10px 20px",
                  textAlign: "left",
                  backgroundColor: answers[q.id] === opt ? "#e0e0e0" : "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#f0f0f0")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor =
                    answers[q.id] === opt ? "#e0e0e0" : "white")
                }
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        style={{
          display: "block",
          margin: "40px auto",
          padding: "10px 30px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
      {submitStatus && (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: submitStatus.includes("Error") ? "red" : "green",
          }}
        >
          {submitStatus}
        </div>
      )}
    </div>
  );
}
