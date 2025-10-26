import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCoverLetter(resumeText, jobTitle, companyName, jobDescription){
    try {
        const prompt = `You are a professional cover letter writer.
    
    Resume: ${resumeText}

    Job Details:
    - Job Title: ${jobTitle}
    - Company: ${companyName}
    - Description: ${jobDescription}
    
    Write a professional, personalized cover letter (250-300 words) that:
    1. Matches resume experience to job requirements
    2. Shows enthusiasm for the role
    3. Uses professional but warm tone
    4. Includes specific examples from the resume

    Format with proper paragraphs.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Error generating cover letter:', error.message);
        throw error;
    }
}

export { generateCoverLetter };