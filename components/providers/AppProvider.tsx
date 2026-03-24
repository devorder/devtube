import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";

const urlEndPoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ImageKitProvider urlEndPoint={urlEndPoint}>
        {children}
      </ImageKitProvider>
    </SessionProvider>
  );
};

export default AppProvider;
