import React from "react";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="w-full h-full">{children}</div>;
};
export default AuthLayout;
