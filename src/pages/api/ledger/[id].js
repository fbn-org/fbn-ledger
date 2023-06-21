import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {

    const mongoClient = await clientPromise;
    const { id } = req.query;

    if (req.method === "PUT") {
        const body = req.body

        const data = await mongoClient.db("ledger").collection("transactions").updateOne({
            _id: new ObjectId(id)
        }, {
            $set: {
                ...body
            }
        })

        res.status(200).json(data);
    } else if (req.method === "DELETE") {

        const data = await mongoClient.db("ledger").collection("transactions").deleteOne({
            _id: new ObjectId(id)
        })

        res.status(200).json(data);
    }
}