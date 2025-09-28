"use client";

import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="font-bold text-3xl text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      {actions && <div className="flex items-center space-x-3">{actions}</div>}
    </div>
  );
}
