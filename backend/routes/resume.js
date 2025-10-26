import express from 'express';
import { generateCoverLetter } from '../controllers/aiController.js';
import {getAuthUrl, saveToken, createCoverLetterDoc} from '../controllers/googleDocsController.js'

const router = express.Router();


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


// get google authrization URL 
router.get('/auth/google', (req, res) =>{
    const authUrl = getAuthUrl();
    res.json({authUrl})
})

// handle oAuth call back
router.get('/auth/callback', async (req, res)=>{
    const {code} = req.query;
    await saveToken(code)
    res.send('Authorization successful! You can close this window ')
})


// create google docs

router.post('/create-google-doc', async(req, res)=>{
    try {
        const {coverLetter, jobTitle, companyName} = req.body;
        const docUrl = await createCoverLetterDoc(coverLetter, jobTitle, companyName)
        res.json({success: true, docUrl})
    } catch (error) {
        // Return 401 if authorization is missing
        if (error.message.includes('Missing OAuth token')) {
            return res.status(401).json({success:false, error: error.message})
        }
        res.status(500).json({success:false, error: error.message})
    }
})
export default router;