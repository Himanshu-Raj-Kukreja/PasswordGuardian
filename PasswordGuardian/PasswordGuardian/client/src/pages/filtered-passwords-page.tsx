import { Button } from "@/components/ui/button";
import { PasswordList } from "@/components/password-list";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { ArrowLeft, LogOut } from "lucide-react";

export default function FilteredPasswordsPage() {
  const { logoutMutation } = useAuth();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const filter = searchParams.get('filter');
  const value = searchParams.get('value');

  let title = 'All Passwords';
  if (filter === 'strong') title = 'Strong Passwords';
  else if (filter === 'weak') title = 'Weak Passwords';
  else if (filter === 'duplicate') title = 'Duplicate Passwords';
  else if (filter === 'category') {
    title = `${value?.charAt(0).toUpperCase()}${value?.slice(1)} Passwords`;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
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
        <PasswordList />
      </main>
    </div>
  );
}
