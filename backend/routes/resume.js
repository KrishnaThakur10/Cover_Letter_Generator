import express from 'express';
import { generateCoverLetter } from '../controllers/aiController.js';

const router = express.Router();

// GET route for testing in browser
router.get('/generate-cover-letter', (req, res) => {
    res.json({ 
        message: 'Cover Letter Generator API',
        method: 'POST',
        endpoint: '/api/resume/generate-cover-letter',
        requiredFields: {
            resumeText: 'string',
            jobTitle: 'string',
            companyName: 'string',
            jobDescription: 'string (optional)'
        },
        example: {
            resumeText: "Your resume text here",
            jobTitle: "Frontend Developer",
            companyName: "Google",
            jobDescription: "Job description here"
        }
    });
});

// POST route for generating cover letter
router.post('/generate-cover-letter',
    async (req, res) => {
        try {
            const { resumeText, jobTitle, companyName, jobDescription } = req.body;
            const coverLetter = await generateCoverLetter(resumeText, jobTitle, companyName, jobDescription);
            res.json({ success: true, coverLetter });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

export default router;