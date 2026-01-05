import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Bot, Send, Mic, MicOff, Image, Sparkles, Trash2, MessageSquare, Plus, Clock, Zap, Target, Users, Lightbulb } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const CHAT_SESSIONS_KEY = 'alpha-ai-sessions';

const AlphaAI = () => {
  const [chatInput, setChatInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [genZMode, setGenZMode] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get active session messages
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem(CHAT_SESSIONS_KEY);
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        const loadedSessions = parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(loadedSessions);
        if (loadedSessions.length > 0) {
          setActiveSessionId(loadedSessions[0].id);
        }
      } catch (e) {
        console.error('Failed to parse sessions:', e);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Create new chat session
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  // Clear current chat
  const handleClearChat = () => {
    if (!activeSessionId) return;
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId 
        ? { ...s, messages: [], updatedAt: new Date() }
        : s
    ));
    toast.success("Chat cleared! 🧹");
  };

  // Delete a session
  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
    toast.success("Chat deleted!");
  };

  // Web Speech API for voice input
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.info("Listening...", { duration: 2000 });
    };
    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join('');
      setChatInput(transcript);
    };
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast.error("Failed to recognize speech");
    };
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        setUploadedImage(e.target?.result as string);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Update session title based on first message
  const updateSessionTitle = (sessionId: string, content: string) => {
    const title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title } : s
    ));
  };

  // Send message to AI
  const handleSendMessage = async () => {
    if (!chatInput.trim() && !uploadedImage) return;
    
    // Create session if none exists
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSessions(prev => [newSession, ...prev]);
      currentSessionId = newSession.id;
      setActiveSessionId(newSession.id);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      image: uploadedImage || undefined,
      timestamp: new Date()
    };

    // Update session with new message
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const updatedMessages = [...s.messages, userMessage];
        // Update title if first message
        if (s.messages.length === 0) {
          updateSessionTitle(s.id, chatInput);
        }
        return { ...s, messages: updatedMessages, updatedAt: new Date() };
      }
      return s;
    }));

    const currentInput = chatInput;
    const currentImage = uploadedImage;
    setChatInput("");
    setUploadedImage(null);
    setIsAiLoading(true);

    try {
      const currentSession = sessions.find(s => s.id === currentSessionId);
      const apiMessages = (currentSession?.messages || []).map(msg => ({
        role: msg.role,
        content: msg.content,
        image: msg.image
      }));
      apiMessages.push({
        role: "user",
        content: currentInput,
        image: currentImage || undefined
      });

      const { data, error } = await supabase.functions.invoke('alpha-ai-chat', {
        body: {
          messages: apiMessages,
          genZMode,
          enhancePrompt: false
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Sorry, I couldn't process that request.",
        timestamp: new Date()
      };

      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages: [...s.messages, assistantMessage], updatedAt: new Date() }
          : s
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Prompt enhancer
  const handleEnhancePrompt = async () => {
    if (!chatInput.trim()) {
      toast.error("Please enter a prompt to enhance");
      return;
    }
    setIsAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('alpha-ai-chat', {
        body: {
          messages: [{ role: "user", content: chatInput }],
          genZMode: false,
          enhancePrompt: true
        }
      });
      if (error) throw error;
      setChatInput(data.response || chatInput);
      toast.success("Prompt enhanced! ✨");
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      toast.error("Failed to enhance prompt");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex gap-4">
        {/* Sidebar - Chat History */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-72 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden shrink-0"
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10">
            <Button 
              onClick={handleNewChat}
              variant="outline"
              className="w-full gap-2 bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 text-white transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="p-3 rounded-full bg-white/5 mb-3">
                  <MessageSquare className="h-8 w-8 text-white/40" />
                </div>
                <p className="text-sm text-white/60 font-medium">No chat history yet</p>
                <p className="text-xs text-white/40 mt-1">Start a new conversation!</p>
              </div>
            ) : (
              sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeSessionId === session.id 
                      ? 'bg-white/10 border border-white/20 shadow-lg shadow-white/5' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                  onClick={() => setActiveSessionId(session.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg ${
                      activeSessionId === session.id ? 'bg-white/20' : 'bg-white/5'
                    }`}>
                      <MessageSquare className={`h-3.5 w-3.5 ${
                        activeSessionId === session.id ? 'text-white' : 'text-white/50'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        activeSessionId === session.id ? 'text-white' : 'text-white/70'
                      }`}>
                        {session.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock className="h-3 w-3 text-white/30" />
                        <span className="text-xs text-white/40">
                          {formatDate(session.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-white/50 hover:text-white/80" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col bg-card border border-border rounded-2xl overflow-hidden"
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={logo} alt="Alpha AI" className="w-10 h-10 rounded-xl" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">Alpha AI</h3>
                <p className="text-xs text-muted-foreground">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/30">
                <span className="text-xs text-muted-foreground">Gen Z Mode</span>
                <Switch
                  checked={genZMode}
                  onCheckedChange={setGenZMode}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearChat}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 relative"
          >
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div 
                  key="welcome"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center h-full text-center relative z-10"
                >
                  {/* Animated Bot Icon */}
                  <motion.div 
                    className="relative mb-8"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <motion.div 
                      className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10"
                      animate={{ 
                        boxShadow: ["0 10px 40px -10px rgba(220, 38, 38, 0.1)", "0 10px 40px -10px rgba(220, 38, 38, 0.3)", "0 10px 40px -10px rgba(220, 38, 38, 0.1)"]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Bot className="h-14 w-14 text-primary" />
                    </motion.div>
                    {/* Floating particles */}
                    <motion.div 
                      className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary/30"
                      animate={{ y: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-primary/20"
                      animate={{ y: [5, -5, 5], opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                  </motion.div>

                  <motion.h3 
                    className="text-3xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    Welcome to Alpha AI
                  </motion.h3>
                  
                  <motion.p 
                    className="text-muted-foreground max-w-lg text-base leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    I'm your intelligent campus assistant. Ask me anything about opportunities, events, teams, or get help with your projects!
                  </motion.p>

                  {/* Interactive Suggestion Cards */}
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 w-full max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {[
                      { text: "Find hackathons near me", icon: Target, color: "from-orange-500/10 to-red-500/10", iconColor: "text-orange-500" },
                      { text: "How to improve my profile?", icon: Lightbulb, color: "from-yellow-500/10 to-amber-500/10", iconColor: "text-yellow-500" },
                      { text: "Suggest team building activities", icon: Users, color: "from-blue-500/10 to-cyan-500/10", iconColor: "text-blue-500" },
                      { text: "What opportunities match my skills?", icon: Zap, color: "from-purple-500/10 to-pink-500/10", iconColor: "text-purple-500" },
                    ].map((suggestion, index) => (
                      <motion.button
                        key={suggestion.text}
                        onClick={() => setChatInput(suggestion.text)}
                        className={`group relative flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br ${suggestion.color} border border-border/50 hover:border-primary/30 transition-all duration-300 text-left overflow-hidden`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        <div className={`shrink-0 w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center ${suggestion.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                          <suggestion.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                          {suggestion.text}
                        </span>
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </motion.button>
                    ))}
                  </motion.div>

                  {/* Quick tips */}
                  <motion.div 
                    className="mt-8 flex items-center gap-2 text-xs text-muted-foreground/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Pro tip: Use the sparkle button to enhance your prompts</span>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  key="messages"
                  className="space-y-4 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: index === messages.length - 1 ? 0.1 : 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] group ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                        {message.image && (
                          <motion.img
                            src={message.image}
                            alt="Uploaded"
                            className="max-w-[250px] rounded-xl mb-2 shadow-lg"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                          />
                        )}
                        <div
                          className={`px-5 py-3.5 rounded-2xl shadow-sm transition-all duration-200 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md hover:shadow-lg hover:shadow-primary/20'
                              : 'bg-muted/80 backdrop-blur-sm text-foreground rounded-bl-md border border-border/50 hover:bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${message.role === 'user' ? 'text-right' : ''}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Loading indicator */}
            <AnimatePresence>
              {isAiLoading && (
                <motion.div 
                  className="flex justify-start relative z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="bg-muted/80 backdrop-blur-sm rounded-2xl rounded-bl-md px-5 py-4 border border-border/50">
                    <div className="flex gap-2 items-center">
                      <motion.span 
                        className="w-2.5 h-2.5 bg-primary/70 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span 
                        className="w-2.5 h-2.5 bg-primary/70 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.span 
                        className="w-2.5 h-2.5 bg-primary/70 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                      />
                      <span className="text-xs text-muted-foreground ml-2">Alpha is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-border bg-gradient-to-t from-muted/30 to-transparent">
            <AnimatePresence>
              {uploadedImage && (
                <motion.div 
                  className="mb-4 relative inline-block"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                >
                  <img src={uploadedImage} alt="Preview" className="h-24 rounded-xl shadow-lg border border-border" />
                  <motion.button
                    onClick={() => setUploadedImage(null)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 h-11 w-11 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Image className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMicClick}
                  className={`shrink-0 h-11 w-11 transition-all duration-300 ${isListening ? 'text-primary bg-primary/10 animate-pulse' : 'hover:bg-primary/10 hover:text-primary'}`}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </motion.div>
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Alpha AI anything..."
                  className="w-full px-5 py-3.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 pr-14 text-base transition-all duration-300"
                  disabled={isAiLoading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity duration-300" />
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  whileHover={{ scale: 1.15, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEnhancePrompt}
                    disabled={isAiLoading || !chatInput.trim()}
                    className="h-8 px-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 rounded-lg text-amber-400 hover:text-amber-300 transition-all duration-300"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSendMessage}
                  disabled={isAiLoading || (!chatInput.trim() && !uploadedImage)}
                  className="shrink-0 h-11 w-11 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                  size="icon"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AlphaAI;
