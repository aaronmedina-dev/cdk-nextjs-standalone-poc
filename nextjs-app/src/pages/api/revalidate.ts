import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure the request is coming as a POST (recommended for security)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    // Check if a secret token is included for security (to prevent unauthorized revalidation)
    const secret = 'Obliviate'; // HARDCODED FOR NOW - TECHNICAL DEBT
    if (req.query.secret !== secret) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        const { path } = req.query;

        if (!path) {
            return res.status(400).json({ message: 'Path is required' });
        }

        // Trigger revalidation for the specified path
        await res.revalidate(path as string);

        return res.status(200).json({ message: `Successfully revalidated: ${path}` });
    } catch (error) {
        console.error('Error revalidating:', error);
        return res.status(500).json({ message: 'Error revalidating' });
    }
}