import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import clientPromise from '@/lib/mongodb';

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise, {
        databaseName: 'auth'
    }),

    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
        // ...add more providers here
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        }
    },
    pages: {
        signIn: '/auth'
    }
};

export default NextAuth(authOptions);
