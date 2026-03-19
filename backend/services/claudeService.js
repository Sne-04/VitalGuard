const Anthropic = require('@anthropic-ai/sdk');

class ClaudeService {
    constructor() {
        this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        this.model = 'claude-3-5-sonnet-20241022';
    }

    async analyzeSymptoms(symptoms) {
        try {
            const prompt = `As a medical AI assistant, analyze these symptoms: ${symptoms.join(', ')}. 
      Provide a brief, user-friendly explanation of what these symptoms might indicate.
      Keep the response under 100 words and use a caring, professional tone.`;

            const message = await this.client.messages.create({
                model: this.model,
                max_tokens: 256,
                messages: [
                    { role: 'user', content: prompt }
                ],
            });

            return message.content[0].text;
        } catch (error) {
            console.error('Claude API Error:', error);
            return 'Unable to generate AI analysis at this time.';
        }
    }

    async getHealthAdvice(disease, severity) {
        try {
            const prompt = `Provide 3-5 practical health tips for managing ${disease} with ${severity} severity.
      Format as bullet points. Be concise and actionable.`;

            const message = await this.client.messages.create({
                model: this.model,
                max_tokens: 512,
                messages: [
                    { role: 'user', content: prompt }
                ],
            });

            return message.content[0].text;
        } catch (error) {
            console.error('Claude API Error:', error);
            return 'Get adequate rest, stay hydrated, and consult a healthcare provider.';
        }
    }
}

module.exports = new ClaudeService();
