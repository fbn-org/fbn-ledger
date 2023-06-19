import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {

    const mongoClient = await clientPromise;
    if (req.method === "POST") {
        const body = req.body

        const data = await mongoClient.db("ledger").collection("transactions").insertOne({
            ...body
        })

        res.status(200).json(data);
    }
}