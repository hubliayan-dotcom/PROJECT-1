import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeSensorData(sensorData: any) {
  const prompt = `
    Analyze the following IoT sensor data from a NASA C-MAPSS turbofan engine.
    Predict the Remaining Useful Life (RUL) and the probability of failure within the next 30 cycles.
    
    Sensor Data:
    ${JSON.stringify(sensorData, null, 2)}
    
    Provide the analysis in JSON format with the following fields:
    - failureProbability: (0 to 1)
    - predictedRUL: (estimated cycles remaining)
    - status: ("Healthy", "Warning", "Critical")
    - recommendations: (array of strings)
    - keyFactors: (array of strings identifying which sensors are most concerning)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing sensor data:", error);
    return {
      failureProbability: 0.1,
      predictedRUL: 100,
      status: "Unknown",
      recommendations: ["Unable to perform AI analysis at this time."],
      keyFactors: [],
    };
  }
}
