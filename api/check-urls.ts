import { IncomingMessage, ServerResponse } from 'http'; // Standard Node.js types
import { MongoClient } from 'mongodb';
import axios from 'axios';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
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

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'URL checks completed' }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  } finally {
    await client.close();
  }
}
