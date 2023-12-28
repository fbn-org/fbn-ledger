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

    const groupData = await mongoClient
        .db('ledger')
        .collection('groups')
        .findOne({
            _id: new ObjectId(id)
        });

    if (req.method === 'GET') {
        let peopleData = [];

        for (let i = 0; i < groupData.people.length; i++) {
            const person = groupData.people[i];
            const userData = await mongoClient
                .db('auth')
                .collection('users')
                .findOne({
                    _id: new ObjectId(person)
                });

            peopleData.push(userData);
        }

        res.status(200).json({
            group: groupData,
            people: peopleData
        });
    } else if (req.method === 'DELETE') {
        if (groupData.createdBy !== session.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const removedGroupData = await mongoClient
            .db('ledger')
            .collection('groups')
            .deleteOne({
                _id: new ObjectId(id)
            });

        // remove group from users
        const peopleData = await mongoClient
            .db('auth')
            .collection('users')
            .updateMany(
                {
                    groups: id
                },
                {
                    $pull: {
                        groups: id
                    }
                }
            );

        // delete all associated occasions
        const occasionData = await mongoClient.db('ledger').collection('occasions').deleteMany({
            group: id
        });

        console.log(occasionData);

        // delete all associated ledger entries
        const ledgerData = await mongoClient.db('ledger').collection('transactions').deleteMany({
            group: id
        });

        console.log(ledgerData);

        res.status(200).json(groupData);
    } else if (req.method === 'PUT') {
        const body = req.body;

        delete body._id;

        const groupData = await mongoClient
            .db('ledger')
            .collection('groups')
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

        res.status(200).json(groupData);
    }
}
