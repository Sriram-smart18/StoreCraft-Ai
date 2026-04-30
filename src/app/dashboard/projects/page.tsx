"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Store, PenTool, Trash2, Loader2, Search, Download, CheckCircle2, FileArchive } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Export State
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects/list");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = (id: string) => {
    setExportingId(id);
    setExportProgress(0);
    
    const duration = 3000;
    const interval = 50;
    const step = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setExportProgress(prev => {
        if (prev + step >= 100) {
          clearInterval(timer);
          setTimeout(() => setExportingId(null), 1500);
          return 100;
        }
        return prev + step;
      });
    }, interval);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative z-10">
      <div className="mx-auto max-w-6xl space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl shadow-[0_0_15px_rgba(109,40,217,0.3)]">
              <FolderOpen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Saved Projects</h1>
              <p className="text-muted-foreground mt-1 text-lg">Manage and export your generated assets.</p>
            </div>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-9 bg-black/40 border-white/10 text-white focus-visible:ring-primary rounded-full h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] border border-white/10 rounded-2xl text-muted-foreground p-8 text-center bg-white/5 backdrop-blur-md">
            <div className="p-4 bg-white/5 rounded-full mb-4">
              <FolderOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="max-w-sm">You haven't generated any projects yet or none match your search criteria.</p>
            <div className="mt-8 flex gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <a href="/dashboard/create-store">Create Store</a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <a href="/dashboard/product-generator">Product Chat</a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col bg-black/40 backdrop-blur-xl border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(109,40,217,0.3)] group">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <div className="flex justify-between items-start">
                      <div className={`p-2 rounded-lg mb-3 ${project.type === "store" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                        {project.type === "store" ? (
                          <Store className="h-5 w-5" />
                        ) : (
                          <PenTool className="h-5 w-5" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-1 rounded-full uppercase tracking-wider border border-white/5">
                        {project.type}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-1 text-white text-lg">{project.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pt-4">
                    <div className="text-sm text-muted-foreground bg-black/50 p-3 rounded-lg line-clamp-3 border border-white/5">
                      {project.type === "store" 
                        ? project.output?.heroCopy?.headline || "Store Layout Generation" 
                        : project.output?.shortDescription || "Product Description Generation"}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-white/5 flex justify-between gap-2">
                    {project.type === "store" ? (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 transition-colors"
                        onClick={() => handleExport(project._id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export ZIP
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-white/10 hover:bg-white/10 text-white"
                        onClick={() => alert(JSON.stringify(project.output, null, 2))}
                      >
                        View Details
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 shrink-0" 
                      onClick={() => handleDelete(project._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {exportingId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] p-8 max-w-sm w-full space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 relative">
                  {exportProgress < 100 ? (
                    <FileArchive className="h-8 w-8 text-accent animate-pulse" />
                  ) : (
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  )}
                  {exportProgress < 100 && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-accent/20"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-accent"
                        strokeDasharray="188.5"
                        strokeDashoffset={188.5 - (188.5 * exportProgress) / 100}
                        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                      />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {exportProgress < 100 ? "Compiling Assets..." : "Export Complete!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {exportProgress < 100 ? "Packaging React components, CSS, and configuration files into a ZIP archive." : "Your store is ready to deploy."}
                </p>
              </div>

              {exportProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-accent">
                    <span>Exporting store_layout.zip</span>
                    <span>{Math.floor(exportProgress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-linear"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
