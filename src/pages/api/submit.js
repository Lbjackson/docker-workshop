import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { answers } = req.body;
      console.log("Received answers:", answers);

      if (!answers || Object.keys(answers).length === 0) {
        return res.status(400).json({ error: "No answers provided" });
      }

      // Create one answer at a time
      for (const [questionId, option] of Object.entries(answers)) {
        try {
          await prisma.quizAnswer.create({
            data: {
              questionId: parseInt(questionId),
              selectedOption: option,
            },
          });
          console.log(`Created answer for question ${questionId}`);
        } catch (error) {
          console.error(
            `Error creating answer for question ${questionId}:`,
            error
          );
          throw error;
        }
      }

      res.status(200).json({
        message: "Answers submitted successfully",
        count: Object.keys(answers).length,
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        error: "Database error",
        details: error.message,
        code: error.code,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
