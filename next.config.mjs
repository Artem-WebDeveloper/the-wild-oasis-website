/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
