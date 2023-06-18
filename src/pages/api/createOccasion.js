import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const body = req.body

    const data = await mongoClient.db("ledger").collection("occasions").insertOne({
        ...body
    })

    res.status(200).json({ id: data.insertedId });
}