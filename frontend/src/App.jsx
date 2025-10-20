import { useState } from 'react'
import './App.css'
import OCRUpload from './components/OCRUpload'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <OCRUpload/>
    </>
  )
}

export default App
