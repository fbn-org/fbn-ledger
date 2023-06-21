/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        PASSWORD: process.env.PASSWORD,
    }
}

module.exports = nextConfig
