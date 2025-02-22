import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import { TbMessageChatbotFilled } from "react-icons/tb";

const Chatbox = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [errors, setErrors] = useState("");
  const [langErr, setLanguageError] = useState("");

  // Handle input text change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Add new message with default target language
  const addMessages = () => {
    if (inputText.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: inputText,
          targetLanguage: "fr",
          translatedText: "",
          detectedLanguage: "",
        },
      ]);
      setInputText("");
    } else {
      toast.error("Please enter a valid message");
    }
  };

  // Update language for a specific message
  const handleLangChange = (event, index) => {
    const newLang = event.target.value;
    setMessages((prevMessages) =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, targetLanguage: newLang } : msg
      )
    );
  };

  // Translate specific message
  const handleTranslate = async (index) => {
    const messageToTranslate = messages[index];

    if (messageToTranslate.targetLanguage === "en") {
      toast.error("Cannot translate into the same language");
      return;
    }

    if (!("ai" in self && "translator" in self.ai)) {
      setErrors("Translation not available on this browser");
      return;
    }

    try {
      setIsLoading(true);
      const translator = await self.ai.translator.create({
        sourceLanguage: "en",
        targetLanguage: messageToTranslate.targetLanguage,
      });

      const translatedText = await translator.translate(messageToTranslate.text);

      
      const detector = await self.ai.languageDetector.create();
      const { detectedLanguage, confidence } = (await detector.detect([
          messages[index].text,
        ]))[0];
        
        const displayName = new Intl.DisplayNames(["en"], { type: "language" });
        const langName = displayName.of(detectedLanguage);
        
        
        // Update only the selected message with the translated text
        setMessages((prevMessages) =>
          prevMessages.map((msg, i) =>
            i === index ? { ...msg, translatedText, detectedLanguage: `${langName} (${(confidence * 100).toFixed(1)}%)` } : msg
          )
        );
        
    } catch (error) {
      setErrors(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Detect Language Function
  const handleDetectLanguage = async (index) => {
    if (!("ai" in self && "languageDetector" in self.ai)) {
      setLanguageError("Language detector not available on this browser");
      return;
    }

    try {
      setIsLoading(true);
      const detector = await self.ai.languageDetector.create();
      const { detectedLanguage, confidence } = (await detector.detect([
        messages[index].text,
      ]))[0];

      const displayName = new Intl.DisplayNames(["en"], { type: "language" });
      const langName = displayName.of(detectedLanguage);

      // Update the detected language for the specific message
      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index ? { ...msg, detectedLanguage: `${langName} (${(confidence * 100).toFixed(1)}%)` } : msg
        )
      );
    } catch (error) {
      console.error(error);
      setLanguageError("Error detecting language");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form>
      <div className="flex justify-center flex-col items-center h-screen">
        <div className="bg-white sm:w-[50%] sm:h-[500px] w-full h-screen p-1 flex flex-col justify-between rounded-2xl">
          <div className="header p-1 w-full flex items-center bg-header-gray rounded-tl-2xl rounded-tr-2xl">
            <TbMessageChatbotFilled className="text-fuchsia-900" size={30} />
            <h1 className="bg-header-gray text-fuchsia-400 p-5 rounded-2xl h-10 flex items-center">
              AI-Powered Text Processor
            </h1>
          </div>
          <div className="py-3 rounded-3xl no-scroll-bar overflow-y-auto">
            <ul>
              {messages.map((message, index) => (
                <li
                  className="text-right py-2 rounded-2xl flex flex-col justify-start gap-y-3"
                  key={index}
                  id={`message-${index}`}
                >
                  <div className="bg-grayWhite-gray w-fit py-2 ml-auto rounded-2xl px-2">
                    <p className="text-fuchsia-400 break-words text-right">
                      {message.text}
                     {/* <p> {handleDetectLanguage(index)}</p> */}
                    </p>
                    <span
                      className={`${
                        isLoading ? "animate-pulse" : ""
                      } text-fuchsia-950 rounded-2xl px-2 text-right block`}
                    >
                      {isLoading ? "Detecting..." : message.detectedLanguage}
                      <span className="text-red-800 font-extrabold">{langErr}</span>
                      {/* <p>{handleDetectLanguage(index)}</p> */}
                    </span>
                  </div>

                  <div className="bg-bluish-blue rounded-2xl p-3 w-fit">
                    <p className={`break-words ${isLoading ? "animate-pulse" : ""} text-left`}>
                      Translate: <br />
                      {isLoading ? "processing....." : message.translatedText}
                      <span className="text-red-800 font-extrabold">{errors}</span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleTranslate(index)}
                      className="bg-fuchsia-900 text-white py-1 px-2 rounded-lg"
                    >
                      Translate
                    </button>


                    <select
                      className="w-fit rounded-2xl py-1 outline-none bg-Textarea-gray text-fuchsia-700 border-fuchsia-700"
                      onChange={(e) => handleLangChange(e, index)}
                      value={message.targetLanguage}
                      name="lang"
                    >
                      <option value="en">English</option>
                      <option value="pt">Portuguese</option>
                      <option value="es">Spanish</option>
                      <option value="ru">Russian</option>
                      <option value="tr">Turkish</option>
                      <option value="fr">French</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDetectLanguage(index)}
                      className="bg-fuchsia-400 text-white py-1 px-2 rounded-lg"
                    >
                      Detect Language
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-Textarea-gray flex justify-center items-start p-4 rounded-2xl mt-5">
            <textarea
              onChange={handleInputChange}
              value={inputText}
              className={`w-full bg-Textarea-gray outline-none resize-none h-20 text-black rounded-3xl px-5 ${
                errors ? "border border-red-500" : "border-0"
              }`}
              placeholder="Type a New Message"
              name="body"
              id="body"
            ></textarea>
            <button type="button" onClick={addMessages}>
              <IoSend className="text-fuchsia-400" size={30} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Chatbox;
