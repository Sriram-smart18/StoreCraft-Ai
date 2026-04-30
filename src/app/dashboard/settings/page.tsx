"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, User, Lock, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure? This will delete all your projects and account data permanently.")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences and security.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <CardDescription>Your personal account details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={user?.name || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={user?.email || ""} disabled />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 text-sm text-muted-foreground">
                * Profile updates will be available in Phase 2.
              </CardFooter>
            </Card>

            {/* Security Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="h-5 w-5 text-primary" />
                  <CardTitle>Security</CardTitle>
                </div>
                <CardDescription>Manage your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="••••••••" disabled />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">* Password change coming in Phase 2.</span>
                <Button disabled variant="outline">Update Password</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1 text-red-600 dark:text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                  <CardTitle>Danger Zone</CardTitle>
                </div>
                <CardDescription className="text-red-600/80 dark:text-red-400">
                  Irreversible destructive actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}
