/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'images.unsplash.com',
            },
            {
              protocol: 'https',
              hostname: 'lxlfwrdbdhafahrrgtzk.supabase.co',
            },
          ],
    },
      transpilePackages: ["@imgly/background-removal"],
};

export default nextConfig;
