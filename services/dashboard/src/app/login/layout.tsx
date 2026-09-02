import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gray-900 absolute top-0 left-0 z-50">
      {children}
    </div>
  );
}
