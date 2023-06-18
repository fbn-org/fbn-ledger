import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {

    const mongoClient = await clientPromise;

    if (req.method === "GET") {
        const data = await mongoClient.db("ledger").collection("ledger").find().toArray();

        res.status(200).json(data);
    }
}