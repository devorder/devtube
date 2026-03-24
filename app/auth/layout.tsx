import React from "react";
import type { Metadata } from "next";
import "../globals.css";
export const metadata: Metadata = {
  title: "DevTube - Sign In",
  description:
    "Sign in to your DevTube account to access your personalized dashboard, manage your videos, and connect with the community. Enter your email and password to get started.",
};
const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={``}>
        <div className="w-full h-full">{children}</div>;
      </body>
    </html>
  );
};
export default AuthLayout;
