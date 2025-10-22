import { google } from 'googleapis'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()


const CREDENTIALS_PATH = './credentials.json'
const TOKEN_PATH = 'token.json'

// load credentials
// const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
//const {client_id, client_secret, redirect_uris} = credentials.web;

const oAuth2Client  = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS
    // client_id,
    // client_secret,
    // redirect_uris[0]
);

// generate auth URL 
function getAuthUrl(){
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/documents',
            'https://www.googleapis.com/auth/drive'
        ]
    });
    return authUrl;
}

// save token after user authorizes 
async function saveToken(code) {
    const {tokens} = await oAuth2Client.getToken(code)
    oAuth2Client.setCredentials(tokens)
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens))
    return tokens;
}


// create google docs with cover letter 
try {
    async function createCoverLetterDoc(coverLetterText, jobTitle, companyName) {
        // load saved tken 
        if(fs.existsSync(TOKEN_PATH)){
            const token = JSON.parse(fs.readFileSync(TOKEN_PATH))
            oAuth2Client.setCredentials(token)
        }
    
    const docs = google.docs({version: 'v1', auth: oAuth2Client})
    const drive = google.drive({version: 'v3', auth: oAuth2Client})
    
    
    // create new document 
    const createResponse = await docs.documents.create({
        requestBody: {
            title: `Cover Letter - ${jobTitle} at ${companyName}`
        }
    })
    
    const documentId = createResponse.data.documentId;
    
    // insert cover letter text 
    await docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
            requests:[
                {
                    insertText:{
                        location: {index: 1},
                        text: coverLetterText
                    }
                }
            ]
        }
    })
    
    // make document acccessible (anyone with the link can view)
    await drive.permissions.create([
        fileId = documentId,
        requestBody = {
            role: 'writer',
            type: 'anyone'
        }
    ])
    return `https://docs.google.com/document/d/${documentId}/edit`
    
    } 
} catch (error) {
    console.error('Error creating google docs:', error);
    throw new Error('Failed to create document')
    
}
