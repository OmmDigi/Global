import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
// export default defineConfig({
//   server: {
//     host: process.env.VITE_HOST || "127.0.0.1",
//     port: parseInt(`${process.env.VITE_PORT}`),
//   },
//   plugins: [
//     react(),
//     svgr({
//       svgrOptions: {
//         icon: true,
//         // This will transform your SVG to a React component
//         exportType: "named",
//         namedExport: "ReactComponent",
//       },
//     }),
//   ],
//   //  esbuild: {
//   //   tsconfigRaw: {
//   //     compilerOptions: {
//   //       // disables type checking
//   //       checkJs: false,
//   //       noEmit: true,
//   //       skipLibCheck: true,
//   //     },
//   //   },
//   // },
// });

export default defineConfig(({ mode }) => {
  // Load env variables from .env files or shell
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: env.VITE_HOST || "192.168.0.214",
      port: parseInt(env.VITE_PORT) || 3000,
    },
    preview: {
      host: env.VITE_HOST || "192.168.0.214",
      port: parseInt(env.VITE_PORT) || 3000,
    },

    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
          // This will transform your SVG to a React component
          exportType: "named",
          namedExport: "ReactComponent",
        },
      }),
    ],
  };
});
