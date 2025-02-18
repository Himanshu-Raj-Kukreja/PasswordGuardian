import { Button } from "@/components/ui/button";
import { PasswordForm } from "@/components/password-form";
import { PasswordList } from "@/components/password-list";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { ChartBarIcon, LogOut } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Password Manager</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <div className="space-y-8">
            <PasswordForm />
          </div>
          <div>
            <PasswordList />
          </div>
        </div>
      </main>
    </div>
  );
}
