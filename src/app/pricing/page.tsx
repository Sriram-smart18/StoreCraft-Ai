"use client";

import Link from "next/link";
import { Store, Check, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PricingPage() {
  const [showModal, setShowModal] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const handleAction = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000);
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      yearlyPrice: "$0",
      period: isYearly ? "/year" : "/month",
      description: "Perfect to try out StoreCraft AI features.",
      features: ["3 Store Generations", "5 Product Descriptions", "Standard Templates", "Community Support"],
      buttonText: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      yearlyPrice: "$290",
      period: isYearly ? "/year" : "/month",
      description: "For serious e-commerce builders & agencies.",
      features: ["Unlimited Generations", "Advanced Premium Templates", "Priority AI Logic", "Email Support"],
      buttonText: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      yearlyPrice: "$990",
      period: isYearly ? "/year" : "/month",
      description: "Custom solutions for large scale teams.",
      features: ["Custom Branding", "Team Access UI", "Advanced Analytics", "24/7 Dedicated Support"],
      buttonText: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <header className="flex h-16 items-center justify-between px-6 lg:px-10 border-b border-white/10 bg-black/40 backdrop-blur-md relative z-20">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">StoreCraft AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-white/5">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(109,40,217,0.5)] transition-all">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground"
            >
              Choose the perfect plan for your e-commerce journey. No hidden fees.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-white' : 'text-muted-foreground'}`}>Monthly</span>
              <div
                className="relative inline-flex h-7 w-14 cursor-pointer items-center rounded-full bg-white/10 border border-white/20 transition-colors"
                onClick={() => setIsYearly(!isYearly)}
              >
                <motion.div
                  className="h-5 w-5 rounded-full bg-primary shadow-[0_0_10px_rgba(109,40,217,0.8)]"
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  animate={{ x: isYearly ? 30 : 4 }}
                />
              </div>
              <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${isYearly ? 'text-white' : 'text-muted-foreground'}`}>
                Yearly <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">Save 20%</span>
              </span>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-center max-w-5xl mx-auto mt-16 relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />

            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative h-full"
              >
                <Card className={`relative h-full flex flex-col transition-all duration-500 bg-black/40 backdrop-blur-xl group hover:-translate-y-2
                  ${plan.popular 
                    ? "border-primary shadow-[0_0_40px_-10px_rgba(109,40,217,0.4)] scale-105 z-10" 
                    : "border-white/10 hover:border-white/30 hover:shadow-2xl z-0"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-5 left-0 right-0 flex justify-center z-20">
                      <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-white/20"
                      >
                        <Zap className="h-3 w-3 fill-current" /> Most Popular
                      </motion.div>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4 pt-8">
                    <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                    <CardDescription className="min-h-[40px] mt-2 text-muted-foreground">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-8">
                    <div className="flex items-baseline justify-center gap-1 text-5xl font-extrabold text-white relative">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={isYearly ? plan.yearlyPrice : plan.price}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isYearly ? plan.yearlyPrice : plan.price}
                        </motion.span>
                      </AnimatePresence>
                      {plan.period && <span className="text-lg text-muted-foreground font-medium">{plan.period}</span>}
                    </div>
                    <ul className="space-y-4 px-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className={`p-1 rounded-full ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'}`}>
                            <Check className="h-3 w-3" />
                          </div>
                          <span className="text-sm font-medium text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-6 pb-8">
                    <Button 
                      className={`w-full h-12 text-base font-semibold group transition-all duration-300 ${
                        plan.popular 
                          ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-[0_0_20px_rgba(109,40,217,0.4)] text-white border-0" 
                          : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      }`}
                      onClick={handleAction}
                    >
                      {plan.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-black/80 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(109,40,217,0.2)] p-8 max-w-sm w-full text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white">Coming Soon</h3>
              <p className="text-muted-foreground">Payment integration will be available in Phase 2 of the launch.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
