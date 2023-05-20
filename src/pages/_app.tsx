import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { type BaseThemeTaggedType } from "@clerk/types";
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark as BaseThemeTaggedType,
        variables: {
          colorPrimary: "#e2e8f0",
        },
      }}
      {...pageProps}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
