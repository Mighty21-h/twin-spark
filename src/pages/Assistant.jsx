import React, { useState } from 'react';
import { FiSend, FiMessageSquare, FiCpu, FiUser } from 'react-icons/fi';

const Assistant = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAssistant = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      if (data.reply) {
        setResponse(data.reply);
      } else {
        setResponse(data.error || "Received empty answer from AI.");
      }
    } catch (error) {
      setResponse("Error: Could not connect to the backend. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="glass-card rounded-[2rem] p-8 lg:p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-12 -mb-12" />
          <div className="relative z-10 flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-xl mb-6">
                 <FiCpu className="text-3xl text-indigo-600 animate-pulse" />
             </div>
             <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                AI <span className="text-indigo-600 dark:text-indigo-400">Assistant</span>
             </h1>
             <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-medium text-lg leading-relaxed">
                Your intelligent companion. Ask for language translations, study tips, or any general assistance you need right now.
             </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 relative z-20">
          
          <div className="p-6 md:p-8 space-y-8 bg-gray-50/30 dark:bg-gray-900/10 min-h-[300px]">
             
             {/* Input Area */}
             <div className="relative mb-4">
                 <div className="absolute left-6 top-6 text-gray-400">
                     <FiUser className="text-xl" />
                 </div>
                 <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me to translate or help with something..."
                    rows="4"
                    className="w-full bg-white dark:bg-gray-800 border-none rounded-3xl pl-16 pr-6 py-6 text-base font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/20 shadow-md transition-shadow outline-none resize-none scrollbar-hide"
                 />
                 <div className="flex justify-end mt-4">
                    <button 
                        onClick={askAssistant} 
                        disabled={loading || !input.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Thinking...
                            </>
                        ) : (
                            <>
                                Ask Assistant <FiSend className="text-lg" />
                            </>
                        )}
                    </button>
                 </div>
             </div>

             {/* Response Area */}
             {response && (
                 <div className="animate-fade-in-up mt-8">
                     <div className="flex items-start gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex shrink-0 items-center justify-center shadow-lg shadow-indigo-600/20">
                             <FiMessageSquare className="text-xl" />
                         </div>
                         <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[2rem] rounded-tl-lg shadow-md border border-gray-100 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-200 leading-relaxed text-base md:text-lg w-full prose dark:prose-invert">
                             {response.split('\n').map((line, index) => (
                                 <React.Fragment key={index}>
                                     {line}
                                     <br />
                                 </React.Fragment>
                             ))}
                         </div>
                     </div>
                 </div>
             )}
             
             {!response && !loading && (
                 <div className="h-40 flex flex-col items-center justify-center text-center opacity-40">
                     <FiMessageSquare className="text-5xl mb-4" />
                     <h3 className="text-xl font-bold">Awaiting your prompt</h3>
                     <p className="text-sm mt-1 max-w-sm">I'm powered by Google Gemini and ready to assist you!</p>
                 </div>
             )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Assistant;
