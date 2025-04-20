import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const model = "gpt-4";

const generationConfig = {
  temperature: 1,
  top_p: 0.95,
  max_tokens: 8192,
};

const prompt = `Generate Travel Plan for Location: Las Vegas, for 3 Days for a Couple with a Cheap budget. 
Give me a list of hotel options with Hotel Name, Hotel address, Price, hotel image URL, geo coordinates, rating, descriptions, 
and suggest an itinerary with Place Name, Place Details, Place Image URL, Geo Coordinates, ticket pricing, rating, Time travel each of the locations for 3 days with each day's plan with best time to visit in JSON format.`;

const chatSession = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: generationConfig.temperature,
      max_tokens: generationConfig.max_tokens,
    });

    const chatResponse = response.choices[0].message.content;
    console.log(chatResponse);
  } catch (error) {
    console.error("Error generating travel plan:", error);
  }
};

chatSession();
