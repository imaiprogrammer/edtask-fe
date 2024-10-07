import reactLogo from './assets/react.svg'
import './index.css'

import FileUploader from './components/FileUploader'

const App = () => {

  const handleFileUpload = () => {

  }

  return (
    <div className='container mx-auto p-4 min-h-screen flex flex-col items-center'>
      <h1 className='text-4xl font-bold text-center'>Excellent Driving Institute Assessment</h1>
      <div className="card bg-white shadow-lg rounded-lg p-6 m-6 w-full max-w-md">
        <FileUploader onUpload={handleFileUpload} maxFiles={1} />
      </div>
    </div>
  )
}

export default App
