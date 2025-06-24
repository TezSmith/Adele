import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function getCoachResponse(prompt: string): Promise<string> {
    console.log("Received prompt for coach:", prompt);
    try {
        const response = await client.responses.create({
            model: "gpt-4",
            input: prompt,
        });

        const answer = response.output_text || "No response generated";
        return answer;
    } catch (error) {
        console.error("Error fetching coach response:", error);
        throw new Error("Failed to get coach response");
    }
}

