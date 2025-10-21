import { useState } from 'react'
import './App.css'
import CoverLetterGenerator from './components/CoverLetterGenerator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <CoverLetterGenerator/>
    </>
  )
}

export default App
