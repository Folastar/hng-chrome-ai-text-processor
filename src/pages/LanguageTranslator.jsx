// import React, { useEffect, useState } from 'react';

// const LanguageTranslator = () => {
//   const [inputText, setInputText] = useState('');
//   const [outputText, setOutputText] = useState('');
//   const [detectedLanguage, setDetectedLanguage] = useState('not sure what language this is');
//   const [language, setLanguage] = useState('en');
//   const [detector, setDetector] = useState(null);



 
//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <form  className="space-y-4">
//         <textarea
//           className="w-full p-2 border rounded"
//           placeholder="Type text here..."
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//         />
//         <span className="block text-sm text-gray-600">{detectedLanguage}</span>
//         <select
//           className="w-full p-2 border rounded"
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//         >
//           <option value="en">English</option>
//           <option value="ja">Japanese</option>
//           <option value="es">Spanish</option>
//         </select>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Translate
//         </button>
//       </form>
//       <output className="block mt-4 p-2 border rounded">{outputText}</output>
//     </div>
//   );
// };

// export default LanguageTranslator;
