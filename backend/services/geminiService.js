const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async analyzeSymptoms(symptoms) {
        try {
            const prompt = `As a medical AI assistant, analyze these symptoms: ${symptoms.join(', ')}. 
      Provide a brief, user-friendly explanation of what these symptoms might indicate.
      Keep the response under 100 words and use a caring, professional tone.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            return 'Unable to generate AI analysis at this time.';
        }
    }

    async getHealthAdvice(disease, severity) {
        try {
            const prompt = `Provide 3-5 practical health tips for managing ${disease} with ${severity} severity.
      Format as bullet points. Be concise and actionable.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            return 'Get adequate rest, stay hydrated, and consult a healthcare provider.';
        }
    }
}

module.exports = new GeminiService();
