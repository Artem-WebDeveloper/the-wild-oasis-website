/** @type {import('next').NextConfig} */
const nextConfig = {
  /*   typescript: {
    ignoreBuildErrors: true,
  }, */
  images: {
    qualities: [75, 80, 100],

    // unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kaakjseyjzwmbsdptdop.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
  },
  // output: "export",
};

export default nextConfig;
