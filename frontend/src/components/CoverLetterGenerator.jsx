import { useState, useEffect } from "react";
import React from "react";
import Tesseract from 'tesseract.js'
import axios from 'axios'

function CoverLetterGenerator() {
  const [resumeImage, setResumeImage] = useState(null);
  const [resumeText, setResumeText] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [authUrl, setAuthUrl] = useState('')
  const [docUrl, setDocUrl] = useState('')


//const API_URL = 'https://cover-letter-generator-backend-t1jc.onrender.com'
  // Getting Text from Image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setResumeImage(file);
    setLoading(true);

    Tesseract.recognize(URL.createObjectURL(file), 'eng')
    .then(({data: {text}})=>{
      if(!text ){
        alert('Could not extract text. Try some clear image.')
        setLoading(false)
        return
      }
        setResumeText(text)
        setLoading(false)
        setStep(2)
    })
    .catch((error)=>{
        console.log(error);
        setLoading(false)
    })
  };



  // Generate Cover Letter 
  const GenerateCoverLetter = async () => {
    setLoading(true)
    try {
        // const response = await axios.post(`${API_URL}/generate-cover-letter`, {
        const response = await axios.post(`http://localhost:5000/api/resume/generate-cover-letter`, {
            resumeText,
            jobTitle, 
            companyName,
            jobDescription
        });
        setCoverLetter(response.data.coverLetter);
        setStep(3)
    } catch (error) {
        alert('Error:', error.message)
    }
    setLoading(false)
  }


  // async function generateWithRetry(prompt, maxRetries = 3) {
  //   for(let i=0; i<maxRetries; i++){
  //     try {
  //       return await GenerateCoverLetter
  //     } catch (error) {
        
  //     }
  //   }
  // }
  

  // get auth URL on component 
  useEffect(() => {
    try {
      
      axios.get('http://localhost:5000/api/resume/auth/google')
      .then(res => setAuthUrl(res.data.authUrl))
    } catch (error) {
      console.log(error.message);
      
    }
  }, [setAuthUrl])

  // create google docs
  const createGoogleDoc = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/resume/create-google-doc', {
        coverLetter,
        jobTitle, 
        companyName
      });
      setDocUrl(response.data.docUrl)
    } catch (error) {
      if(error.response?.status === 401) {
        alert('Please authrize Google Docs first!')
        window.open(authUrl,'_blank')
      }
      else{
        alert('Error:', error.message)
      }
    }
    setLoading(false)
  }
  

  return (
    <div className=" w-screen h-screen">
      <div className="h-full w-full px-10 md:px-20 py-7 md:py-14 flex flex-col items-center gap-10 bg-green-50">
        <h1 className="text-4xl font-semibold">Resume to Cover Letter </h1>
        {step === 1 && (
            <div className="h-full  w-full flex flex-col  gap-3 mt-5">
                <h2 className="text-xl font-normal">Upload Your Resume (Image or Pdf)</h2>
                <div className="h-16 w-16 mt-5">
                  <input type="file" accept="image/*,application/pdf" onChange={handleImageUpload} className="cursor-pointer bg-gray-50 hover:bg-green-50 border-2 border-dashed hover:border-blue-600 border-gray-200 transition-colors duration-300  px-3 py-2"/>
                </div>
                {loading && <p>Extraction text from your Resume...</p>}
            </div>
        )}
        {step === 2 && (
            <div  className="h-full w-full flex flex-col  gap-3 mt-5">
                <h2 className="text-xl font-normal">Tell Us About the Job</h2>
                <textarea className="w-full p-4 text-gray-800 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring focus:ring-green-200 focus:border-green-400 placeholder-gray-400  transition-all outline-none" rows={5} value={resumeText} onChange={(e)=> setResumeText(e.target.value)} placeholder="Extracted Resume text (you can edit)"></textarea>
                
                <input className="w-2/3 md:w-1/3 p-4 text-gray-800 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring focus:ring-green-200 focus:border-green-400 placeholder-gray-400  transition-all outline-none" type="text" placeholder="Job Title (e.g., Frontend Developer)" value={jobTitle} onChange={(e)=>setJobTitle(e.target.value)}/>
                
                <input className="w-2/3 md:w-1/3 p-4 text-gray-800 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring focus:ring-green-200 focus:border-green-400 placeholder-gray-400  transition-all outline-none" type="text" placeholder="Company Name (e.g., Google)" value={companyName} onChange={(e)=>setCompanyName(e.target.value)}/>
                
                <textarea className="w-full p-4 text-gray-800 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring focus:ring-green-200 focus:border-green-400 placeholder-gray-400 transition-all outline-none" rows={3} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste Job Description (optional)"></textarea>
                
                <button onClick={GenerateCoverLetter} disabled={!jobTitle || !companyName || !resumeText || loading} className="w-fit px-4 md:px-6  mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1 transition-all  mx-auto disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {loading ? 'Generating...' : 'Generate Cover Letter'}
                </button>
            </div>
        )}
        {step === 3 && (
            <div className="h-full  w-full flex flex-col  gap-3 mt-5">
                <h2 className="text-xl font-normal">Your Cover Letter is Ready</h2>
                <textarea className="w-full p-4 text-gray-800 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring focus:ring-green-200 focus:border-green-400 placeholder-gray-400 transition-all outline-none" value={coverLetter} onChange={(e)=> setCoverLetter(e.target.value)} rows={15}>
                </textarea>
                <div className="flex justify-between">
                    <button className="px-4 md:px-6  mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1 transition-all " onClick={() => navigator.clipboard.writeText(coverLetter)}>Copy to Clipboard</button>
                    <button className="px-4 md:px-6  mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1 transition-all " onClick={() => setStep(1)}>Start Over</button>
                </div>
                    <button className="px-4 md:px-6  mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1 transition-all " onClick={createGoogleDoc} disabled={loading}>{loading? 'Creating Doc...': 'Create Google Doc'}</button>
                    {docUrl && (
                      <div>
                        <h3 className="text-sm font-normal">Google doc Created Successfully</h3>
                        <a href={docUrl} target="_blank" rel="noopener noreferrer">Open in Google Docs</a>
                      </div>
                    )}
            </div>
        )}
      </div>
    </div>
  );
}

export default CoverLetterGenerator;
