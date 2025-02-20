import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { TbMessageChatbotFilled } from "react-icons/tb";
const Chatbox = () => {
  const [inputText, setInputText] = useState(""); //text area input field
  const [isLoading, setIsLoading] = useState(false); //render a loader or process
  const [language, setDetectedLanguage] = useState("");
  const [dispayLang, setDispalyLang] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("fr"); //default lang
  const [messages, setMessages] = useState([]);
  const [detectedMsg, setDetectedMessages]= useState([])

  const [errors,setErrors]= useState("")


  const handleLangChange = (e) => {
    const newLang= e.target.value
    setTargetLanguage(newLang);
    handleSubmit(newLang)

  };
  
  if(!('translator' in self.ai) || !('languageDetector' in self.ai) || !('summarizer' in self.ai)){
    alert('your browser does not support this application')
}




  const languagePair= {
    sourceLanguage: "en",
    targetLanguage: targetLanguage, //dynamic input of languages
  };
            





  const addMessages = () => {
    if(inputText.trim()!==""){
        setMessages((m) => [ inputText, ]); //add new messages into array
        setInputText("");
        setDetectedMessages((m)=> [...m, language])
    

    }
        
    
  };
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };



  const Translate = async () => {
        //   setIsLoading(true)
        try {
          const translator = await self.ai.translator.create(languagePair);             
      const output = await translator.translate(inputText);
      console.log(output);
      setDispalyLang(output);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };
  
  // language translate end

  // detector starts
  
  const Detector = async (text)=>{
      if(!("languageDetector" in self.ai)){
          setErrors("language detection not available on device model")
          return
        }
        
        try{
            const detector =await self.ai.languageDetector.create()
            const {detectedLanguage,confidence}= (await detector.detect(messages))[0]
            const output = `i am ${(confidence* 100).toFixed(1)}% sure this is`
            const displayName =new Intl.DisplayNames([detectedLanguage], {type:"language"})
            const langName= displayName.of(detectedLanguage)
            setDetectedLanguage(`${output} ${langName}`)
            console.log(language)
       
        }
    catch(error){

    }
}
  

const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    //     alert('what are you doing')
    //     return
    // } 
    // if (inputText < 3) {
    //     console.log("connot be blank");
   
    try{
            setIsLoading(true)
            const translator = await self.ai.translator.create(languagePair);
            const detector =await self.ai.languageDetector.create(messages)

             const translated = await translator.translate(messages);
            console.log(translated);
            setDispalyLang(translated);


        const {detectedLanguage,confidence}= (await detector.detect(messages))[0]
        const output = `i am ${(confidence* 100).toFixed(1)}% sure this is`
        const displayName =new Intl.DisplayNames([detectedLanguage], {type:"language"})
       const langName= displayName.of(detectedLanguage)
        setDetectedLanguage(`${output} ${langName}`)
        console.log(language)
        
    }
    catch(error){

    }

    finally{
        setIsLoading(false)
        
    }
  };
  // detector()


  
  return (

    <form onSubmit={handleSubmit}>

    
    <div className="flex justify-center flex-col items-center h-screen ">
      <div className="bg-white sm:w-[50%] h-[500px] p-1 flex flex-col justify-between rounded-2xl">
        <div className="header p-1 w-full flex items-center  bg-header-gray rounded-tl-2xl rounded-tr-2xl">
          {/* <img src="" alt="logo" />
                <p>fkdfd</p> */}
          <TbMessageChatbotFilled className="text-fuchsia-900" size={30} />
          {/* <p>kklk</p> */}
          <h1 className="bg-header-gray text-fuchsia-400 p-5 rounded-2xl h-10 flex items-center  ">
            AI-Powered Text Processor
          </h1>
        </div>

        <div className=" py-3 rounded-3xl">
          <ul>
            {messages.map((message, index) => (
              <li
                className="text-right py-2 rounded-2xl  flex flex-col justify-start gap-y-3"
                key={index}
                id={`message-${message.index}`}  >

                    <div>

                        <p className="text-fuchsia-400  text-right">{message} </p>
                    </div>
                <div className="bg-bluish-blue rounded-2xl p-3 w-50">
                    <span id={`message-${message.index}`} className={`${isLoading? "animate-pulse": ""}  my-3 text-fuchsia-950 text-left block`}>{isLoading?"processing...":language}</span>
                    <p className={`  ${isLoading? "animate-pulse": ""} text-left`}>translatd lang {isLoading?"processing.....":dispayLang}</p>

                </div>
                
                <p>{targetLanguage}</p>

                
              </li>
              
            ))}
          </ul>
        </div>

        <p>english {inputText}</p>

        <p>translated lang: {dispayLang}</p>

        {targetLanguage}

        {/* text input */}
        <div className="bg-Textarea-gray flex  justify-center items-start p-4 rounded-2xl mt-5">
      <div  className="  w-fit border-fuchsia-700">
                  <label id="lang" htmlFor="lang" className="">
                    Translate
                    <select
                      className="w-fit outline-none bg-Textarea-gray text-fuchsia-700 border-fuchsia-700"
                      onChange={handleLangChange}
                      value={targetLanguage}
                      name="lang"
                    //   id={`lang-${message.index}`}
                    >
                      <option value="en">English</option>
                      <option value="pt">Portuguese</option>
                      <option value="es">Spanish</option>
                      <option value="ru">Russian</option>
                      <option value="tr">Turkish</option>
                      <option value="fr">French</option>
                    </select>
                  </label>
                </div>
          <textarea
            onChange={handleInputChange}
            value={inputText}
            className=" w-full bg-Textarea-gray outline-none resize-none h-20 text-black rounded-3xl px-5 flex items-center  justify-center"
            placeholder="Type a New Message"
            name="body"
            id="body"
          ></textarea>
          <button onClick={addMessages}>
            <IoSend className="text-fuchsia-400" size={30} />
          </button>
        </div>
      </div>
    </div>

</form>
  );
};

export default Chatbox;
