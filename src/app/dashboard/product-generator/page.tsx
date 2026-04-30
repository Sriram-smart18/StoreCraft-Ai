"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PenTool, Loader2, Send, Bot, User, Copy, RefreshCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TypingEffect } from "@/components/TypingEffect";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string | any; // AI content might be object initially, we'll format it
  isJson?: boolean;
};

export default function ProductGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I'm your AI product copywriter. What product would you like me to write a description for today?",
      isJson: false
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessage: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, newMessage]);
    setPrompt("");
    setLoading(true);

    // Map the prompt to the required backend schema
    const inputs = {
      productName: text,
      features: "Premium features and high-quality build",
      audience: "Target customers seeking the best experience"
    };

    try {
      const res = await fetch("/api/projects/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "product", inputs }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: data.project.output,
          isJson: true
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "Sorry, I encountered an error generating the copy. Please try again.",
          isJson: false
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Sorry, a network error occurred. Please try again.",
        isJson: false
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMessage) {
      handleGenerate(lastUserMessage.content);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative z-10 p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-4xl flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_-15px_rgba(6,182,212,0.15)] relative">
        
        {/* Header */}
        <div className="h-16 border-b border-white/10 bg-black/40 flex items-center justify-between px-6 shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 text-accent rounded-lg">
              <PenTool className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">AI Copywriter Chat</h1>
            </div>
          </div>
          {messages.length > 2 && (
            <Button variant="ghost" size="sm" onClick={handleRegenerate} className="text-muted-foreground hover:text-white" disabled={loading}>
              <RefreshCcw className="h-4 w-4 mr-2" /> Regenerate
            </Button>
          )}
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-primary/20 text-primary border border-primary/30" : "bg-accent/20 text-accent border border-accent/30"}`}>
                    {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  
                  <div className={`group relative flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`p-4 rounded-2xl ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-black/40 border border-white/10 text-foreground rounded-tl-sm backdrop-blur-sm"}`}>
                      {msg.isJson ? (
                        <div className="space-y-4 w-full">
                          <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
                            <TypingEffect content={JSON.stringify(msg.content, null, 2)} />
                          </pre>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>

                    {msg.role === "ai" && msg.isJson && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-white"
                        onClick={() => handleCopy(msg.id, JSON.stringify(msg.content, null, 2))}
                      >
                        {copiedId === msg.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-4 max-w-[85%] flex-row">
                <div className="shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-accent/20 text-accent border border-accent/30">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 rounded-tl-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-2 w-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-2 w-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/60 border-t border-white/10 shrink-0 backdrop-blur-md">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleGenerate(prompt); }}
            className="relative flex items-center max-w-3xl mx-auto"
          >
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Write a product description for an ergonomic gaming chair..."
              className="w-full bg-white/5 border-white/10 focus-visible:ring-accent focus-visible:border-accent text-white h-14 pl-6 pr-14 rounded-full shadow-inner"
              disabled={loading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!prompt.trim() || loading}
              className={`absolute right-2 rounded-full h-10 w-10 transition-all duration-300 ${prompt.trim() ? "bg-accent hover:bg-accent/90 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-white/10 text-muted-foreground"}`}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <div className="text-center mt-3 text-xs text-muted-foreground">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
        
      </div>
    </div>
  );
}
