import clientPromise from '../../../../lib/mongodb'

import { ObjectId } from 'mongodb'

import validatePassword from '@/lib/validatePassword';

export default async function handler(req, res) {

    if(!validatePassword(req.headers.password)){
        res.status(401).json({message: "Unauthorized"})
        return;
    }

    const mongoClient = await clientPromise;
    const { occasionId } = req.query;

    if (req.method === "PUT") {
        const body = req.body

        const data = await mongoClient.db("ledger").collection("transactions").updateMany({
            occasion: occasionId
        }, {
            $set: {
                occasion: "None"
            }
        })

        res.status(200).json(data);
    } else if (req.method === "DELETE") {

        const data = await mongoClient.db("ledger").collection("occasions").deleteOne({
            _id: new ObjectId(id)
        })

        res.status(200).json(data);
    }
}