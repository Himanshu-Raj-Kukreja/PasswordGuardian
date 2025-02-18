import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Dice5 } from "lucide-react";

type GeneratorType = "password" | "passcode";

function generatePassword(): string {
  const length = 12;
  const charset = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  let password = "";
  // Ensure at least one of each type
  password += charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
  password += charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
  password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
  password += charset.symbols[Math.floor(Math.random() * charset.symbols.length)];

  // Fill the rest randomly
  const allChars = Object.values(charset).join("");
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

function generatePasscode(length: number): string {
  const numbers = "0123456789";
  let passcode = "";
  for (let i = 0; i < length; i++) {
    passcode += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return passcode;
}

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void;
}

export function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const [type, setType] = useState<GeneratorType>("password");
  const [passcodeLength, setPasscodeLength] = useState("6");

  const handleGenerate = () => {
    const generated = type === "password" ? generatePassword() : generatePasscode(parseInt(passcodeLength));
    onGenerate(generated);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <RadioGroup value={type} onValueChange={(value) => setType(value as GeneratorType)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="password" id="password" />
              <Label htmlFor="password">Generate Password</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="passcode" id="passcode" />
              <Label htmlFor="passcode">Generate Passcode</Label>
            </div>
          </RadioGroup>

          {type === "passcode" && (
            <div className="space-y-2">
              <Label htmlFor="length">Passcode Length</Label>
              <Input
                id="length"
                type="number"
                min="4"
                max="12"
                value={passcodeLength}
                onChange={(e) => setPasscodeLength(e.target.value)}
              />
            </div>
          )}

          <Button onClick={handleGenerate} className="w-full">
            <Dice5 className="h-4 w-4 mr-2" />
            Generate {type === "password" ? "Password" : "Passcode"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
