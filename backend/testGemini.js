import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCoverLetter(resumeText, jobTitle, companyName){
    try {
        const prompt = `You are a professional cover letter writer.
    
    Resume: ${resumeText}
    Job Title: ${jobTitle}
    Company: ${companyName}
    
    Write a compelling cover letter (200 words max.).`;

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

generateCoverLetter(
    "Krishna Thakur, software engineer with 2 years of react experience",
    "Frontend Developer",
    "Google"
).then(console.log).catch(console.error)