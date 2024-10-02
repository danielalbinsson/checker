import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import axios from 'axios';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await client.connect();
    const db = client.db('your-db-name');
    const urls = await db.collection('urls').find().toArray();

    for (const urlDoc of urls) {
      try {
        const response = await axios.head(urlDoc.url);
        console.log(`Checked ${urlDoc.url}: ${response.status}`);
        // Update the database with the new status here...
      } catch (error) {
        console.error(`Error checking ${urlDoc.url}:`, error.message);
        // Handle error logging or DB updates...
      }
    }

    res.status(200).json({ message: 'URL checks completed' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}
