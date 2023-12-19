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

    if (req.method === 'PUT') {
        const body = req.body;

        console.log(body);

        const data = await mongoClient
            .db('ledger')
            .collection('occasions')
            .updateOne(
                {
                    _id: new ObjectId(id)
                },
                {
                    $set: {
                        ...body
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
