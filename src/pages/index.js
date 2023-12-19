import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Printing(props) {
    const router = useRouter();
    const { data: session } = useSession();
    // Make sure we're in the browser
    if (typeof window !== 'undefined') {
        if (!session) {
            router.push('/auth');
        } else {
            router.push('/dashboard');
        }
    }
}
