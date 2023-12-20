import { Button, Stack, Typography } from '@mui/material';

import ReceiptLong from '@mui/icons-material/ReceiptLong';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { getProviders, signIn } from 'next-auth/react';

import BaseLayout from '@/layouts/BaseLayout';

export default function SignIn({ providers }) {
    return (
        <>
            <Stack
                direction="column"
                width="100%"
                height="100%"
                spacing={2}
                justifyContent="center"
                alignItems="center"
            >
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                >
                    <ReceiptLong fontSize="large" />
                    <Typography variant="h4">Ledger</Typography>
                </Stack>
                {Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                        <Button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</Button>
                    </div>
                ))}
            </Stack>
        </>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
        return { redirect: { destination: '/app/dashboard' } };
    }

    const providers = await getProviders();

    return {
        props: { providers: providers ?? [] }
    };
}

SignIn.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;
