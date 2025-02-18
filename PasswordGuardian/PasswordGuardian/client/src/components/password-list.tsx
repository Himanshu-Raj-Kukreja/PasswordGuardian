import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Password } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Copy, Eye, EyeOff, Trash2, Search, Filter } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

function useFilteredPasswords(passwords: Password[]) {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const filter = searchParams.get('filter');
  const value = searchParams.get('value');

  const isStrongPassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+-=[\]{};:,.<>?]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
  };

  if (!filter || filter === 'all') return passwords;

  switch (filter) {
    case 'strong':
      return passwords.filter(p => isStrongPassword(p.password));
    case 'weak':
      return passwords.filter(p => !isStrongPassword(p.password));
    case 'duplicate': {
      const passwordCounts = passwords.reduce((acc, p) => {
        acc[p.password] = (acc[p.password] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return passwords.filter(p => passwordCounts[p.password] > 1);
    }
    case 'category':
      return passwords.filter(p => p.category === value);
    default:
      return passwords;
  }
}

function getFilterDescription(filter: string | null, value: string | null): string {
  if (!filter || filter === 'all') return 'All Passwords';
  switch (filter) {
    case 'strong':
      return 'Strong Passwords';
    case 'weak':
      return 'Weak Passwords';
    case 'duplicate':
      return 'Duplicate Passwords';
    case 'category':
      return `${value?.charAt(0).toUpperCase()}${value?.slice(1)} Passwords`;
    default:
      return 'All Passwords';
  }
}

export function PasswordList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<number[]>([]);
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const currentFilter = searchParams.get('filter');
  const filterValue = searchParams.get('value');

  const { data: passwords = [] } = useQuery<Password[]>({
    queryKey: ["/api/passwords"],
  });

  const filteredPasswords = useFilteredPasswords(passwords);

  const searchFilteredPasswords = filteredPasswords.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/passwords/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/passwords"] });
      toast({
        title: "Success",
        description: "Password deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Password copied to clipboard",
    });
  };

  return (
    <Card className="transition-all duration-300">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{getFilterDescription(currentFilter, filterValue)}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {searchFilteredPasswords.length} password{searchFilteredPasswords.length !== 1 ? 's' : ''}
            </p>
          </div>
          {currentFilter && currentFilter !== 'all' && (
            <div className="flex items-center gap-2">
              <div className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {currentFilter === 'category' ? filterValue : currentFilter} filter active
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search passwords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {searchFilteredPasswords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No passwords found
            </div>
          ) : (
            searchFilteredPasswords.map((password) => (
              <Card key={password.id} className="group hover:border-primary transition-colors duration-300">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{password.title}</h3>
                      <p className="text-sm text-muted-foreground">{password.username}</p>
                      <p className="text-sm text-muted-foreground capitalize">{password.category}</p>
                    </div>
                    <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePasswordVisibility(password.id)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        {visiblePasswords.includes(password.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(password.password)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(password.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {visiblePasswords.includes(password.id) && (
                    <div className="mt-2 font-mono bg-muted/50 p-2 rounded-md">
                      {password.password}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the password.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteId) {
                    deleteMutation.mutate(deleteId);
                    setDeleteId(null);
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}