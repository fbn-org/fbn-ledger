import { ObjectId } from 'mongodb';

import clientPromise from '../../../../lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;
    const { occasionId } = req.query;
    if (req.method === 'GET') {
        const data = await mongoClient
            .db('ledger')
            .collection('transactions')
            .find({
                occasion: occasionId
            })
            .toArray();

        res.status(200).json(data);
    }
}
