import { google } from 'googleapis'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()


const CREDENTIALS_PATH = './controllers/credentials.json'
const TOKEN_PATH = 'token.json'

// load credentials
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'))
const {client_id, client_secret, redirect_uris} = credentials.web || credentials.installed

const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

// generate auth URL 
function getAuthUrl(){
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        response_type: 'code',
        scope: [
            'https://www.googleapis.com/auth/documents',
            'https://www.googleapis.com/auth/drive.file',
        ],
    })
    return authUrl
}

// save token after user authorizes 
async function saveToken(code) {
    const {tokens} = await oAuth2Client.getToken(code)
    oAuth2Client.setCredentials(tokens)
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2))
    return tokens
}


// create google doc with cover letter
async function createCoverLetterDoc(coverLetterText, jobTitle, companyName) {
    try {
        // load saved token
        if (fs.existsSync(TOKEN_PATH)) {
            const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'))
            oAuth2Client.setCredentials(token)
        } else {
            throw new Error('Missing OAuth token. Visit /api/resume/auth/google to authorize first.')
        }

        const docs = google.docs({ version: 'v1', auth: oAuth2Client })
        const drive = google.drive({ version: 'v3', auth: oAuth2Client })

        // create new document
        const createResponse = await docs.documents.create({
            requestBody: {
                title: `Cover Letter - ${jobTitle} at ${companyName}`,
            },
        })

        const documentId = createResponse.data.documentId

        // insert cover letter text
        await docs.documents.batchUpdate({
            documentId,
            requestBody: {
                requests: [
                    {
                        insertText: {
                            location: { index: 1 },
                            text: coverLetterText,
                        },
                    },
                ],
            },
        })

        // make document accessible (anyone with the link can READ)
        await drive.permissions.create({
            fileId: documentId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        })

        return `https://docs.google.com/document/d/${documentId}/edit`
    } catch (error) {
        console.error('Error creating google doc:', error.response?.data || error.message)
        throw new Error('Failed to create document')
    }
}

export { getAuthUrl, saveToken, createCoverLetterDoc }