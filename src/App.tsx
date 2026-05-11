import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Camera, MapPin, Video, CheckCircle2, Ticket, MessageSquare, Send, Loader2, PlayCircle, StopCircle, Trophy, ShoppingBag, AlertCircle, Bot } from 'lucide-react';

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const [points, setPoints] = useState(1950);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Background color maps
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#020617", "#020617", "#0f172a", "#1e293b", "#020617"]
  );

  const handleRecordComplete = () => {
    setHasRecorded(true);
    setPoints(prev => prev + 500);
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full min-h-screen text-slate-100 font-sans selection:bg-lime-400/30 selection:text-lime-400"
      style={{ backgroundColor }}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(163,230,53,0.15),transparent_70%)] pointer-events-none z-0" />

      {/* Pages Container */}
      <div className="w-full relative z-10">
        <HeroSection />
        <RecordSection onRecordComplete={handleRecordComplete} hasRecorded={hasRecorded} />
        <RewardsSection points={points} hasRecorded={hasRecorded} />
        <ClaimSection />
        <ChatbotSection />
      </div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center -mt-[10vh] px-6 relative z-10">
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-6xl sm:text-7xl md:text-9xl font-black uppercase italic tracking-tighter text-lime-400 leading-none"
      >
        Bin IT<span className="text-2xl md:text-4xl align-top font-normal ml-2">®</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-slate-500 mt-4 text-center z-10"
      >
        Clean the Stadium • Earn the Game
      </motion.p>
      


      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-slate-500 animate-bounce"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-lime-400">Scroll to Play</span>
        <div className="w-[2px] h-12 bg-gradient-to-b from-lime-400 to-transparent" />
      </motion.div>
    </div>
  );
}

function RecordSection({ onRecordComplete, hasRecorded }: { onRecordComplete: () => void, hasRecorded: boolean }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      // Request location first
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(() => {}, (err) => console.log(err));
      }
      // Request camera
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsRecording(true);

      // Simulate recording for 4 seconds
      setTimeout(() => {
        stopRecording(mediaStream);
      }, 4000);
    } catch (err) {
      console.error("Camera access denied", err);
      // Fallback for simulation if camera is denied in iframe
      setIsRecording(true);
      setTimeout(() => stopRecording(null), 4000);
    }
  };

  const stopRecording = (mediaStream: MediaStream | null) => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsRecording(false);
    setIsProcessing(true);

    // Simulate AI verification
    setTimeout(() => {
      setIsProcessing(false);
      onRecordComplete();
    }, 2000);
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center px-10 relative z-10 max-w-7xl mx-auto">
      <div className="md:w-1/2 w-full flex flex-col justify-center">
        <div className="space-y-2 mb-8">
          <span className="px-3 py-1 rounded-full bg-lime-400 text-slate-950 font-black text-xs uppercase inline-block">Step 01: Action</span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.9]">
            Every Toss<br/><span className="text-lime-400">Counts.</span>
          </h2>
          <p className="max-w-md text-slate-400 font-medium leading-relaxed mt-4">
            Your camera is ready. Record yourself throwing trash into the highlighted stadium bin to claim your match-day credits.
          </p>
        </div>

        {/* Video Placeholder Box */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
           <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent pointer-events-none" />
           
           {hasRecorded ? (
             <div className="flex flex-col items-center justify-center gap-4 py-8 relative z-10 text-center animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-lime-400/20 rounded-full flex items-center justify-center mb-2">
                 <CheckCircle2 size={40} className="text-lime-400" />
               </div>
               <h3 className="text-2xl font-black uppercase text-white tracking-tight">Verified!</h3>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Match Location Confirmed.</p>
               <div className="mt-4 animate-bounce text-[10px] text-lime-400 uppercase tracking-widest flex flex-col items-center gap-2 font-black">
                 Scroll for Rewards
                 <div className="w-[2px] h-6 bg-lime-400" />
               </div>
             </div>
           ) : isProcessing ? (
             <div className="flex flex-col items-center justify-center gap-4 py-8 relative z-10 text-center">
               <Loader2 size={48} className="text-lime-400 animate-spin mb-2" />
               <h3 className="text-2xl font-black uppercase tracking-tight text-white">Verifying...</h3>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Checking stadium location</p>
             </div>
           ) : isRecording ? (
             <div className="absolute inset-0 w-full h-full bg-slate-950 z-20 flex items-center justify-center">
                {stream ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="flex flex-col items-center text-slate-600 gap-4">
                     <Camera size={48} className="animate-pulse" />
                     <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500">Simulating Camera</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 text-red-500 px-3 py-1 rounded text-[10px] font-black tracking-widest uppercase border border-red-500/50 blink">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> REC
                </div>
                <div className="absolute bottom-8 left-0 w-full flex justify-center">
                  <div className="bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded text-lime-400 text-[10px] font-black uppercase tracking-widest border border-lime-400/20 flex items-center gap-2 shadow-xl">
                    <MapPin size={12} /> Stadium Detected
                  </div>
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center gap-6 py-8 relative z-10">
                <div className="group relative w-72 h-16 overflow-hidden rounded-xl cursor-pointer" onClick={startRecording}>
                  <div className="absolute inset-0 bg-lime-400 transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center space-x-3 text-slate-950 font-black uppercase tracking-tight text-base shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                    <PlayCircle fill="#020617" className="text-lime-400" />
                    <span>Record Live Video</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-2">
                  <MapPin size={14} className="text-lime-400" /> Stadium Location Required
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function RewardsSection({ points, hasRecorded }: { points: number, hasRecorded: boolean }) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center px-10 relative z-10 text-center">
      <div className="space-y-4 mb-12 flex flex-col items-center">
        <span className="px-3 py-1 rounded-full bg-lime-400 text-slate-950 font-black text-xs uppercase inline-block">Step 02: Verification</span>
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.9]">
          {hasRecorded ? (
            <>You Scored<br/><span className="text-lime-400">Points!</span></>
          ) : (
            <>Earn<br/><span className="text-lime-400">Points.</span></>
          )}
        </h2>
        <p className="max-w-md text-slate-400 font-medium leading-relaxed mt-4">
          {hasRecorded ? (
            "We verified your video and stadium location. Thank you for keeping the venue clean. Your points have been added to your balance."
          ) : (
            "Throw trash in the bin, verify it with a quick video, and score points to unlock rewards."
          )}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto w-full">
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center">
           <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Toss Earned</span>
           <span className="text-4xl font-black text-lime-400 mt-2 italic">{hasRecorded ? "+500" : "0"}</span>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-lime-400/5 blur-2xl rounded-full" />
           <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest relative z-10">Total Balance</span>
           <span className="text-4xl font-black text-slate-100 mt-2 relative z-10">{points.toLocaleString()}</span>
         </div>
      </div>
    </div>
  );
}

function ClaimSection() {
  return (
    <div className="h-screen w-full flex flex-col justify-center px-10 relative z-10 max-w-7xl mx-auto">
      <div className="w-full flex flex-col md:flex-row justify-between gap-12 items-center">
        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="space-y-4 mb-4">
            <span className="px-3 py-1 rounded-full bg-lime-400 text-slate-950 font-black text-xs uppercase inline-block">Step 03: Rewards</span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.9]">
              Claim Real<br/><span className="text-lime-400">Discounts.</span>
            </h2>
            <p className="max-w-md text-slate-400 font-medium leading-relaxed mt-4">
              Turn your stadium cleanliness into real savings. Redeem your points for exclusive food & beverage discounts or save on tickets for future matches.
            </p>
          </div>
          <div className="mt-8 p-4 border-l-2 border-orange-500 bg-slate-900/50 backdrop-blur-sm rounded-r-xl max-w-sm inline-flex flex-col">
            <div className="flex items-center gap-2 text-orange-500 mb-1">
              <AlertCircle size={14} />
              <h3 className="font-black uppercase text-[10px]">Important Notice</h3>
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-tighter">Points are redeemable for discounts only. No cash value.</p>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col gap-6 w-full max-w-md">
          {/* Coupon Card 1 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-lime-400/50 transition-colors shadow-none">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center">
                <ShoppingBag className="text-lime-400" />
              </div>
              <div className="px-4 py-1 bg-slate-800 rounded font-bold text-xs font-mono text-lime-400 border border-lime-400/20">
                1000 PTS
              </div>
            </div>
            <div>
              <h4 className="text-white font-black text-2xl uppercase tracking-tight">20% Off Concessions</h4>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">For your next stadium snack</p>
            </div>
          </div>

          {/* Coupon Card 2 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-lime-400/50 transition-colors shadow-none">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center">
                <Ticket className="text-lime-400" />
              </div>
              <div className="px-4 py-1 bg-slate-800 rounded font-bold text-xs font-mono text-lime-400 border border-lime-400/20">
                2500 PTS
              </div>
            </div>
            <div>
              <h4 className="text-white font-black text-2xl uppercase tracking-tight">₹10 Off Tickets</h4>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Valid for any home game</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatbotSection() {
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: "Hi there! I'm Binbot. How can I help you regarding your points or discount coupons today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length > 1 || isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `You are a helpful customer support chatbot for "Bin IT", an app that rewards users with discount coupons for throwing trash into bins at IPL matched. User asks: "${userMessage}". Answer briefly and politely in 1-2 sentences.` }] }
        ]
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm sorry, I didn't understand that." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between relative z-10 bg-slate-950">
      <div className="w-full flex flex-col md:flex-row gap-12 max-w-7xl mx-auto flex-grow items-center px-10 pt-24 pb-12">
        <div className="w-full md:w-1/2">
          <span className="px-3 py-1 rounded-full bg-lime-400 text-slate-950 font-black text-xs uppercase inline-block mb-4">Step 04: Support</span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.9] mb-4">
            Need<br/><span className="text-lime-400">Help?</span>
          </h2>
          <p className="max-w-md text-slate-400 font-medium leading-relaxed mt-4">
            Having trouble claiming a discount? Did your video not get credited? Ask our Binbot AI!
          </p>
        </div>
        
        <div className="w-full md:w-1/2 flex justify-center">
           <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[400px] w-full max-w-md overflow-hidden shadow-2xl">
              <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center text-slate-950">
                    <Bot size={18} />
                  </div>
                  <div>
                    <span className="font-black text-white uppercase text-sm block leading-none">Binbot Support</span>
                    <span className="text-[10px] text-lime-400 uppercase tracking-widest font-bold">Online</span>
                  </div>
                </div>
              </div>
              <div 
                ref={chatContainerRef}
                className="flex-grow p-4 overflow-y-auto flex flex-col gap-4"
              >
                 {messages.map((m, i) => (
                   <div 
                     key={i} 
                     className={`p-4 rounded-xl text-sm max-w-[80%] font-medium ${
                       m.role === 'bot' 
                         ? 'bg-slate-800 text-slate-100 self-start rounded-tl-sm border border-slate-700' 
                         : 'bg-lime-400 text-slate-950 self-end rounded-tr-sm font-bold shadow-lg'
                     }`}
                   >
                     {m.text}
                   </div>
                 ))}
                 {isTyping && (
                   <div className="bg-slate-800 text-slate-400 self-start p-4 rounded-xl rounded-tl-sm flex items-center gap-2 border border-slate-700">
                     <span className="animate-bounce">.</span>
                     <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                     <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                   </div>
                 )}
              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-900 flex gap-3">
                 <input 
                   type="text" 
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSend()}
                   placeholder="Type your issue..." 
                   className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-lime-400/50 transition-colors" 
                 />
                 <button 
                   onClick={handleSend}
                   disabled={isTyping || !input.trim()}
                   className="bg-lime-400 text-slate-950 w-12 h-12 rounded-lg flex items-center justify-center shrink-0 hover:bg-lime-300 disabled:opacity-50 transition-all font-black"
                 >
                   <Send size={18} />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Footer from Design HTML */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 py-10 bg-slate-900 border-t border-slate-800 z-20 w-full">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-lime-400 flex items-center justify-center text-slate-950">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-lime-400">AI Assistant</h4>
              <p className="text-[10px] text-slate-400 font-medium">Ask about missing credits or coupons</p>
            </div>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-xs text-slate-300 italic font-medium max-w-xs">
            "Hey! Need any help claiming your rewards?"
          </div>
        </div>

        <div className="flex flex-col justify-center items-center md:border-x border-slate-800 py-4 md:py-0">
           <div className="text-center">
             <h4 className="text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Claim Rewards</h4>
             <div className="flex space-x-2 justify-center">
               <div className="px-3 py-1.5 bg-slate-800 rounded font-bold text-xs border border-lime-400/20 text-slate-300">Concessions</div>
               <div className="px-3 py-1.5 bg-lime-400 rounded font-black text-xs text-slate-950 shadow-md">Match Tickets</div>
             </div>
             <p className="text-[9px] mt-3 uppercase text-slate-600 font-bold tracking-tighter italic">*No cash value. Coupons only valid in-stadium.</p>
           </div>
        </div>

        <div className="flex flex-col justify-center items-center md:items-end">
          <div className="text-center md:text-right">
            <h3 className="text-3xl font-black text-lime-400 italic leading-none uppercase">Bin IT<span className="text-[10px] align-top font-normal ml-1">®</span></h3>
            <p className="text-[9px] uppercase tracking-tighter text-slate-500 mb-2 mt-1 font-bold">Trademark & Registered {new Date().getFullYear()}</p>
            <a href="mailto:help@binit.org" className="text-sm font-mono text-slate-300 hover:text-lime-400 underline decoration-lime-400/30 underline-offset-4 transition-colors font-bold">help@binit.org</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

