"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Store, Loader2, Sparkles, RefreshCcw, CheckCircle2, ChevronRight, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TypingEffect } from "@/components/TypingEffect";

const generationSteps = [
  "Analyzing niche and competitor landscape...",
  "Generating unique brand identity and voice...",
  "Building optimized store layout structure...",
  "Writing high-conversion SEO copy..."
];

export default function CreateStorePage() {
  const [inputs, setInputs] = useState({
    brandName: "",
    productType: "Skincare",
    targetAudience: "",
    priceRange: "$$",
    tone: "Minimal",
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;
    
    // Simulate generation workflow progress
    setCurrentStep(0);
    setProgress(0);
    
    const totalDuration = 4000; // Fake duration
    const stepDuration = totalDuration / generationSteps.length;
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + (100 / (totalDuration / 100)); // Update every 100ms
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(s => {
        if (s >= generationSteps.length - 1) {
          clearInterval(stepInterval);
          return s;
        }
        return s + 1;
      });
    }, stepDuration);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [loading]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/projects/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "store", inputs }),
      });

      if (res.ok) {
        const data = await res.json();
        // Give the fake progress bar time to finish
        setTimeout(() => {
          setResult(data.project.output);
          setLoading(false);
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Generation failed");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative z-10">
      <div className="mx-auto max-w-5xl space-y-10">
        
        <div className="flex items-center gap-4 border-b border-border/50 pb-6">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shadow-[0_0_15px_rgba(109,40,217,0.3)]">
            <Store className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Create AI Store</h1>
            <p className="text-muted-foreground mt-1 text-lg">Generate a complete Shopify layout and brand copy in seconds.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Input Form */}
          <div className="lg:col-span-5">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent"></div>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Provide details about your vision.</CardDescription>
              </CardHeader>
              <form onSubmit={handleGenerate}>
                <CardContent className="space-y-5">
                  {error && <div className="text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-md">{error}</div>}
                  
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      className="bg-black/20 border-white/10 focus:border-primary"
                      placeholder="e.g. Lumina Beauty"
                      value={inputs.brandName}
                      onChange={(e) => setInputs({ ...inputs, brandName: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productType">Product Type</Label>
                    <select
                      id="productType"
                      className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:border-primary disabled:opacity-50"
                      value={inputs.productType}
                      onChange={(e) => setInputs({ ...inputs, productType: e.target.value })}
                      disabled={loading}
                    >
                      <option value="Skincare">Skincare</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Tech">Tech</option>
                      <option value="Pet">Pet</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      className="bg-black/20 border-white/10 focus:border-primary"
                      placeholder="e.g. Women 25-40, busy professionals"
                      value={inputs.targetAudience}
                      onChange={(e) => setInputs({ ...inputs, targetAudience: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceRange">Price Range</Label>
                      <select
                        id="priceRange"
                        className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:border-primary disabled:opacity-50"
                        value={inputs.priceRange}
                        onChange={(e) => setInputs({ ...inputs, priceRange: e.target.value })}
                        disabled={loading}
                      >
                        <option value="$">$ (Budget)</option>
                        <option value="$$">$$ (Mid-range)</option>
                        <option value="$$$">$$$ (Premium)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tone">Brand Tone</Label>
                      <select
                        id="tone"
                        className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:border-primary disabled:opacity-50"
                        value={inputs.tone}
                        onChange={(e) => setInputs({ ...inputs, tone: e.target.value })}
                        disabled={loading}
                      >
                        <option value="Minimal">Minimal</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Bold">Bold</option>
                      </select>
                    </div>
                  </div>

                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className={`w-full gap-2 transition-all duration-300 ${loading ? 'bg-primary/50 cursor-not-allowed shadow-[0_0_30px_rgba(109,40,217,0.5)]' : 'bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(109,40,217,0.4)]'}`} 
                    disabled={loading || !inputs.brandName}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating Engine Active...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Initialize Generation
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Output / Timeline View */}
          <div className="lg:col-span-7 h-full">
            <AnimatePresence mode="wait">
              
              {!loading && !result && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[500px] border border-white/10 rounded-xl text-muted-foreground p-8 text-center bg-white/5 backdrop-blur-sm"
                >
                  <div className="p-4 bg-white/5 rounded-full mb-4">
                    <Sparkles className="h-10 w-10 text-primary/50" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Awaiting Parameters</h3>
                  <p className="max-w-xs">Configure your brand details and click generate to launch the AI workflow.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-primary/30 shadow-[0_0_40px_-10px_rgba(109,40,217,0.15)] h-full min-h-[500px] flex flex-col">
                    <CardHeader className="border-b border-white/5 bg-black/20">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Terminal className="h-5 w-5 text-primary" />
                          Neural Generation Workflow
                        </CardTitle>
                        <span className="text-accent text-sm font-mono">{Math.floor(progress)}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden relative">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse mix-blend-overlay"></div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-8 flex flex-col justify-center space-y-8">
                      {generationSteps.map((step, idx) => {
                        const isActive = idx === currentStep;
                        const isPast = idx < currentStep;
                        return (
                          <div key={idx} className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : isPast ? 'opacity-50' : 'opacity-20'}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isPast ? 'bg-primary/20 text-primary' : isActive ? 'bg-accent/20 text-accent ring-2 ring-accent/50 ring-offset-2 ring-offset-background' : 'bg-white/5 text-muted-foreground'}`}>
                              {isPast ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                            </div>
                            <span className={`text-lg font-medium ${isActive ? 'text-accent drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : ''}`}>
                              {step}
                            </span>
                            {isActive && (
                              <Loader2 className="h-4 w-4 text-accent animate-spin ml-auto" />
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="border-primary/40 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_-5px_rgba(109,40,217,0.2)]">
                    <CardHeader className="border-b border-white/10 bg-black/20 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Generation Successful
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => handleGenerate()} className="text-muted-foreground hover:text-white">
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="rounded-lg bg-black/40 border border-white/5 p-4 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-2 opacity-30 pointer-events-none">
                          <Terminal className="h-24 w-24" />
                        </div>
                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap font-mono text-accent/90 relative z-10 leading-relaxed">
                          <TypingEffect content={JSON.stringify(result, null, 2)} />
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
