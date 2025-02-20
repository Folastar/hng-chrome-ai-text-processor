import Chatbox from './pages/Chatbox'
import './App.css'
import  {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import LanguageTranslator from './pages/LanguageTranslator'
function App() {
  

  return (
    <>
    <ToastContainer/>
      <Chatbox/>
      {/* <LanguageTranslator/> */}
    </>
  )
}

export default App
