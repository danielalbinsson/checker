import { MongoClient } from 'mongodb';
import axios from 'axios';

const uri = process.env.MONGODB_URI;  // Your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const normalizeUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'http://' + url;
  }
  return url;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await client.connect();
    const db = client.db('your-db-name');  // Replace with your actual DB name
    const urls = await db.collection('urls').find().toArray();

    const now = new Date();
    const checkPromises = urls.map(async (urlDoc) => {
      const lastCheck = urlDoc.checks[urlDoc.checks.length - 1]?.checkedAt || new Date(0);
      const frequencyInMinutes = urlDoc.frequency * 60 * 1000;

      if (now - new Date(lastCheck) >= frequencyInMinutes) {
        const normalizedUrl = normalizeUrl(urlDoc.url);

        try {
          const response = await axios.head(normalizedUrl);
          await db.collection('urls').updateOne(
            { _id: urlDoc._id },
            { $push: { checks: { statusCode: response.status, checkedAt: now } } }
          );
          console.log(`Checked ${normalizedUrl}: ${response.status}`);
        } catch (error) {
          console.error(`Error checking ${normalizedUrl}:`, error.message);
          const statusCode = error.response ? error.response.status : 500;
          const errorMessage = error.message || 'Unknown error';
          await db.collection('urls').updateOne(
            { _id: urlDoc._id },
            { $push: { checks: { statusCode, errorMessage, checkedAt: now } } }
          );
        }
      }
    });

    await Promise.all(checkPromises);  // Wait for all URL checks to complete
    res.status(200).json({ message: 'URL checks completed successfully' });
  } catch (error) {
    console.error('Error checking URLs:', error);
    res.status(500).json({ message: 'Error checking URLs', error: error.message });
  } finally {
    await client.close();
  }
}
