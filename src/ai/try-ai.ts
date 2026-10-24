import "dotenv/config";
import { reviewProject } from "../ai/gemini";

async function tryAi() {
  const review = await reviewProject(
    "I am writing a thesis on the impact of AI on modern libraries and need books on the subject."
  );
  console.log(JSON.stringify(review, null, 2));
}

tryAi().catch((err: unknown) => {
  console.error("Gemini call failed:", err);
  process.exit(1);
});