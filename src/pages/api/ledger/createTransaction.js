import clientPromise from '../../../lib/mongodb'

import { ObjectId } from 'mongodb'

import validatePassword from '@/lib/validatePassword';

export default async function handler(req, res) {

    if(!validatePassword(req.headers.password)){
        res.status(401).json({message: "Unauthorized"})
        return;
    }

    const mongoClient = await clientPromise;
    if (req.method === "POST") {
        const body = req.body

        const data = await mongoClient.db("ledger").collection("transactions").insertOne({
            ...body
        })

        res.status(200).json(data);
    }
}