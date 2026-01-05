import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Bot, Send, Mic, MicOff, Image, Save, Sparkles, Trash2, MessageSquare, Plus, Clock } from "lucide-react";
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
          className="w-72 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shrink-0"
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <Button 
              onClick={handleNewChat}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquare className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No chat history yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Start a new conversation!</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                    activeSessionId === session.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setActiveSessionId(session.id)}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className={`h-4 w-4 mt-0.5 shrink-0 ${
                      activeSessionId === session.id ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        activeSessionId === session.id ? 'text-primary' : 'text-foreground'
                      }`}>
                        {session.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground/70" />
                        <span className="text-xs text-muted-foreground/70">
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 rounded-lg transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
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
              <div className="flex items-center gap-2">
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
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Bot className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">Welcome to Alpha AI</h3>
                <p className="text-muted-foreground max-w-lg text-base">
                  I'm your intelligent campus assistant. Ask me anything about opportunities, events, teams, or get help with your projects!
                </p>
                <div className="flex flex-wrap gap-3 mt-8 justify-center">
                  {["Find hackathons near me", "How to improve my profile?", "Suggest team building activities"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setChatInput(suggestion)}
                      className="px-5 py-2.5 text-sm bg-muted hover:bg-muted/80 rounded-full text-foreground transition-colors border border-border"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="max-w-[250px] rounded-xl mb-2"
                      />
                    )}
                    <div
                      className={`px-5 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1.5 ${message.role === 'user' ? 'text-right' : ''}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
            {isAiLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-5 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-border bg-muted/20">
            {uploadedImage && (
              <div className="mb-3 relative inline-block">
                <img src={uploadedImage} alt="Preview" className="h-20 rounded-lg" />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 h-11 w-11"
              >
                <Image className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMicClick}
                className={`shrink-0 h-11 w-11 ${isListening ? 'text-primary bg-primary/10' : ''}`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Alpha AI anything..."
                  className="w-full px-5 py-3.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-14 text-base"
                  disabled={isAiLoading}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEnhancePrompt}
                  disabled={isAiLoading || !chatInput.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 px-2"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isAiLoading || (!chatInput.trim() && !uploadedImage)}
                className="shrink-0 h-11 w-11"
                size="icon"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AlphaAI;
