import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";

import { TbMessageChatbotFilled } from "react-icons/tb";
const Chatbox = () => {
  const [inputText, setInputText] = useState(""); //text area input field
  const [isLoading, setIsLoading] = useState(false); //render a loader for process
  const [language, setDetectedLanguage] = useState("");
  const [dispayLang, setDispalyLang] = useState(""); //
  const [targetLanguage, setTargetLanguage] = useState("fr"); //default lang for select buttons
  const [messages, setMessages] = useState([]);
  const [detectedMsg, setDetectedMessages] = useState([]);

  const [errors, setErrors] = useState("");
  const [langErr, setLanguageError]= useState("")
  const [sumErr, setSummerizerError]= useState("")

  if (!('ai' in self && 'languageDetector' in self.ai)){
    setLanguageError("language detector not available on this browser")
  } 

  if (!('ai' in self && 'summarizer' in self.ai)) {
    setSummerizerError("summerizer not available on this browser")
  }
  // FOR INPUT CHANGES
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  //   for select values
  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setTargetLanguage(newLang);
  };

  const languagePair = {
    sourceLanguage: "en",
    targetLanguage: targetLanguage, //dynamic input of languages
  };

  const handleTranslate = async () => {
    if("en" === targetLanguage){
        toast.error("cannot translate same language")
        return
    }
    
    if(!("ai" in self &&'translator' in self.ai)){
        setErrors('not avialble for this browser')
        return
    }
    try{
        const translator = await self.ai.translator.create(languagePair);
        // const detector = await self.ai.languageDetector.create(messages);
        const translated = await translator.translate(messages);
        console.log(translated);
        setDispalyLang(translated);

    }    
    catch(error){
        setErrors(error)
    }
  };

   

  const addMessages = () => {
    if (inputText.trim() !== "") {
      setMessages((m) => [inputText]); //add new messages into array
      setInputText("");
      setDetectedMessages((m) => [...m, language]);
    }

    else{
        // alert("what are you doing")
        // setErrors("what are you trying to acheive?")
        toast.error("what are you doing")
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   

    try {
      setIsLoading(true);
      const detector = await self.ai.languageDetector.create(messages);
      const { detectedLanguage, confidence } = (
        await detector.detect(messages)
      )[0];
      const output = `i am ${(confidence * 100).toFixed(1)}% sure this is`;
      const displayName = new Intl.DisplayNames([detectedLanguage], {
        //inbuilt javascript method to chek for bc47 codes and convert to human readable language
        type: "language",
      });
      const langName = displayName.of(detectedLanguage);
      setDetectedLanguage(`${output} ${langName}`);
      console.log(language);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
          <div className=" py-3 rounded-3xl no-scroll-bar overflow-y-auto">
            <ul>
              {messages.map((message, index) => (
                  <li
                  className="text-right py-2 rounded-2xl  flex flex-col justify-start gap-y-3"
                  key={index}
                  id={`message-${message.index}`}
                  >
                  <div className="bg-grayWhite-gray w-72 ml-auto rounded-2xl px-2">
                    <p className="text-fuchsia-400 break-words  text-right">{message} </p>
                    <span
                      id={`message-${message.index}`}
                      className={`${
                        isLoading ? "animate-pulse" : ""
                      }   text-fuchsia-950  rounded-2xl px-2 text-right block`}
                    >
                      {isLoading ? "processing..." : language}
                      {langErr}
                    </span>
                  </div>
                  <div className="bg-bluish-blue rounded-2xl p-3 w-50">
                    <p
                      className={`  ${
                          isLoading ? "animate-pulse" : ""
                        } text-left `}
                        >
                      Translate: <br />{" "}
                      {isLoading ? "processing....." : dispayLang}
                        <span className="text-red-800 font-extrabold">{errors}</span>
                    </p>
                  </div>

                  <div className="  w-fit border-fuchsia-700">
                    <label id="lang" htmlFor="lang" className="">
                      <button
                        type="button"
                        onClick={handleTranslate}
                        className="bg-fuchsia-900 text-white py-1 px-2 rounded-lg gap-2 "
                      >
                        Translate
                      </button>

                      <select
                        className="w-fit rounded-2xl py-1 mx-2 outline-none bg-Textarea-gray text-fuchsia-700 border-fuchsia-700"
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
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-Textarea-gray flex  justify-center items-start p-4 rounded-2xl mt-5">
            <textarea
              onChange={handleInputChange}
              value={inputText}
              className={` w-full bg-Textarea-gray outline-none resize-none h-20 ${errors? 'border border-red-500':"border-0"} text-black rounded-3xl px-5 flex items-center  justify-center`}
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
