import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';

import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const mongoClient = await clientPromise;
    const { id } = req.query;

    if (req.method === 'GET') {
        const userData = await mongoClient
            .db('auth')
            .collection('users')
            .findOne({
                _id: new ObjectId(id)
            });

        res.status(200).json(userData);
    }
}
