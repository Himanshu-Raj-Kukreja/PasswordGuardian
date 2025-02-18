import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Password } from "@shared/schema";
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Copy,
  FileText,
  Globe,
  Smartphone,
  Folder,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function DashboardStats() {
  const [, setLocation] = useLocation();
  const { data: passwords = [] } = useQuery<Password[]>({
    queryKey: ["/api/passwords"],
  });

  const totalPasswords = passwords.length;

  const uniquePasswords = new Set(passwords.map((p) => p.password)).size;
  const duplicatePasswords = totalPasswords - uniquePasswords;

  const isStrongPassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+-=[\]{};:,.<>?]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
  };

  const strongPasswords = passwords.filter((p) => isStrongPassword(p.password)).length;
  const weakPasswords = totalPasswords - strongPasswords;

  const categoryCount = passwords.reduce(
    (acc, p) => ({
      ...acc,
      [p.category]: (acc[p.category] || 0) + 1,
    }),
    {} as Record<string, number>
  );

  const stats = [
    {
      title: "Total Passwords",
      value: totalPasswords,
      icon: KeyRound,
      description: "Total number of stored passwords",
      onClick: () => setLocation('/passwords?filter=all'),
    },
    {
      title: "Strong Passwords",
      value: strongPasswords,
      icon: ShieldCheck,
      description: "Passwords meeting security standards",
      onClick: () => setLocation('/passwords?filter=strong'),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Weak Passwords",
      value: weakPasswords,
      icon: ShieldAlert,
      description: "Passwords needing improvement",
      onClick: () => setLocation('/passwords?filter=weak'),
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Duplicate Passwords",
      value: duplicatePasswords,
      icon: Copy,
      description: "Passwords used multiple times",
      onClick: () => setLocation('/passwords?filter=duplicate'),
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  const categories = [
    { name: "website", icon: Globe, label: "Websites" },
    { name: "application", icon: Smartphone, label: "Applications" },
    { name: "document", icon: FileText, label: "Documents" },
    { name: "other", icon: Folder, label: "Others" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`relative group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${stat.bgColor || 'hover:bg-primary/5'}`}
            onClick={stat.onClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <stat.icon className={`h-4 w-4 ${stat.color || 'text-muted-foreground'}`} />
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Password Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                className="h-auto p-4 justify-start hover:bg-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
                onClick={() => setLocation(`/passwords?filter=category&value=${category.name}`)}
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <category.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{category.label}</p>
                    <p className="text-2xl font-bold">{categoryCount[category.name] || 0}</p>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}