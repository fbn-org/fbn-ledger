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
    if (req.method === 'POST') {
        const body = req.body;

        const data = await mongoClient
            .db('ledger')
            .collection('groups')
            .insertOne({
                ...body
            });

        console.log(data);

        // add user to group
        const other = await mongoClient
            .db('auth')
            .collection('users')
            .updateOne({ _id: new ObjectId(body.createdBy) }, { $push: { groups: data.insertedId } });

        res.status(200).json(data);
    }
}
