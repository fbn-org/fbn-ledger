import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const data = await mongoClient.db('ledger').collection('people').find().toArray();

    res.status(200).json(data);
}
