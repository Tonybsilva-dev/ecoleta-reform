"use client";

import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthLevel {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: "",
        color: "",
        bgColor: "",
        checks: {
          length: false,
          lowercase: false,
          uppercase: false,
          numbers: false,
          symbols: false,
        },
      };
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /[0-9]/.test(password),
      symbols: /[^a-zA-Z0-9]/.test(password),
    };

    // Calcular pontuação baseada nos critérios
    Object.values(checks).forEach((check) => {
      if (check) score += 20;
    });

    // Bonificação por comprimento
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    const levels: StrengthLevel[] = [
      {
        score: 0,
        label: "Muito fraca",
        color: "text-red-600",
        bgColor: "bg-red-500",
      },
      {
        score: 20,
        label: "Fraca",
        color: "text-red-500",
        bgColor: "bg-red-400",
      },
      {
        score: 40,
        label: "Regular",
        color: "text-orange-500",
        bgColor: "bg-orange-400",
      },
      {
        score: 60,
        label: "Boa",
        color: "text-yellow-500",
        bgColor: "bg-yellow-400",
      },
      {
        score: 80,
        label: "Forte",
        color: "text-green-500",
        bgColor: "bg-green-400",
      },
      {
        score: 100,
        label: "Muito forte",
        color: "text-green-600",
        bgColor: "bg-green-500",
      },
    ];

    const currentLevel = levels.reduce((prev, current) =>
      score >= current.score ? current : prev,
    );

    return {
      ...currentLevel,
      score: Math.min(score, 100),
      checks,
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Força da senha:</span>
          <span className={`font-medium ${strength.color}`}>
            {strength.label}
          </span>
        </div>
        <Progress
          value={strength.score}
          className="h-2"
          style={{
            background: `linear-gradient(to right, ${strength.bgColor} ${strength.score}%, #e5e7eb ${strength.score}%)`,
          }}
        />
      </div>

      <div className="space-y-1">
        <p className="mb-2 text-gray-500 text-xs">Critérios de segurança:</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div
            className={`flex items-center gap-2 ${strength.checks.length ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${strength.checks.length ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span>Mín. 8 caracteres</span>
          </div>
          <div
            className={`flex items-center gap-2 ${strength.checks.lowercase ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${strength.checks.lowercase ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span>Letra minúscula</span>
          </div>
          <div
            className={`flex items-center gap-2 ${strength.checks.uppercase ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${strength.checks.uppercase ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span>Letra maiúscula</span>
          </div>
          <div
            className={`flex items-center gap-2 ${strength.checks.numbers ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${strength.checks.numbers ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span>Número</span>
          </div>
          <div
            className={`flex items-center gap-2 ${strength.checks.symbols ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${strength.checks.symbols ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span>Símbolo especial</span>
          </div>
          <div
            className={`flex items-center gap-2 ${password.length >= 12 ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${password.length >= 12 ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span>12+ caracteres</span>
          </div>
        </div>
      </div>
    </div>
  );
}
