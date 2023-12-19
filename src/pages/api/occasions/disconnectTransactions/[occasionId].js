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
    const { occasionId } = req.query;

    if (req.method === 'PUT') {
        const body = req.body;

        const data = await mongoClient
            .db('ledger')
            .collection('transactions')
            .updateMany(
                {
                    occasion: occasionId
                },
                {
                    $set: {
                        occasion: 'None'
                    }
                }
            );

        res.status(200).json(data);
    } else if (req.method === 'DELETE') {
        const data = await mongoClient
            .db('ledger')
            .collection('occasions')
            .deleteOne({
                _id: new ObjectId(id)
            });

        res.status(200).json(data);
    }
}
