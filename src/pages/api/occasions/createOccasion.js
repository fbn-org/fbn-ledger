import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const mongoClient = await clientPromise;
    if (req.method === 'POST') {
        const body = req.body;

        const data = await mongoClient
            .db('ledger')
            .collection('occasions')
            .insertOne({
                ...body
            });

        res.status(200).json(data);
    }
}
