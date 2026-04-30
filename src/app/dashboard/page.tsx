"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, PenTool, ArrowRight, Zap, FolderOpen, Activity, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const activities = [
    { text: "AI generated Shopify store 'Lumina' in 2.3s", time: "Just now" },
    { text: "Product description optimized for SEO", time: "2m ago" },
    { text: "Store structure completed for 'FitGear'", time: "1hr ago" },
    { text: "AI Tokens replenished automatically", time: "2hrs ago" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative z-10">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-6xl space-y-10"
      >
        
        {/* Welcome Section */}
        <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              System Online
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Welcome back, {user?.name || "Builder"}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Ready to generate your next high-converting e-commerce store?
            </p>
          </div>
          <Link href="/dashboard/create-store">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:shadow-[0_0_30px_rgba(109,40,217,0.5)] transition-all duration-300">
              <Zap className="h-4 w-4" />
              Create New Store
            </Button>
          </Link>
        </motion.div>

        {/* Stats / Mock Data */}
        <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(109,40,217,0.2)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Stores Generated</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">12</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-emerald-400 font-medium">+2</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-accent/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.2)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Products Described</CardTitle>
              <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                <PenTool className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">48</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-emerald-400 font-medium">+14</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">AI Tokens Used</CardTitle>
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                <Zap className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">12.4k</div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-accent w-[78%] h-full rounded-full"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">78% of monthly limit</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 items-start">
          {/* Quick Actions */}
          <motion.div variants={item} className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" /> Core Workflows
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/dashboard/create-store" className="block group">
                <Card className="h-full bg-gradient-to-br from-primary/5 to-transparent border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(109,40,217,0.3)]">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Generate Store</CardTitle>
                    <CardDescription className="mt-2">Create a full Shopify store layout, branding, and copy with AI.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/dashboard/product-generator" className="block group">
                <Card className="h-full bg-gradient-to-br from-accent/5 to-transparent border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <PenTool className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors">Product Chat</CardTitle>
                    <CardDescription className="mt-2">Write high-converting, SEO-optimized product copy in seconds.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </motion.div>

          {/* AI Activity Feed */}
          <motion.div variants={item} className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" /> Activity Feed
            </h2>
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 space-y-6">
                {activities.map((activity, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    className="flex items-start gap-4 relative"
                  >
                    {i !== activities.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-white/5" />
                    )}
                    <div className="mt-1 relative z-10">
                      <CheckCircle2 className="h-6 w-6 text-primary bg-background rounded-full" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-tight">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
