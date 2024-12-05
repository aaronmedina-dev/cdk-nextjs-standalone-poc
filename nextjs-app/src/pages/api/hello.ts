// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name } = req.query;

    // Return a greeting based on the name provided in the query string
    res.status(200).json({
        message: `Hello, ${name || 'World'}! Welcome to the API.`,
    });
}
