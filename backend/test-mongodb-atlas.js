import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Get connection string from .env
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

console.log('🔗 Testing MongoDB Atlas Connection...');
console.log('URI (masked):', uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));

async function testConnection() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  try {
    console.log('\n⏳ Connecting...');
    await client.connect();
    console.log('Connected to MongoDB Atlas!');

    // Test admin commands
    const adminDb = client.db('admin');
    const pingResult = await adminDb.command({ ping: 1 });
    console.log('Ping successful:', pingResult);

    // List databases
    const dbList = await adminDb.admin().listDatabases();
    console.log('\Available Databases:');
    dbList.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    // Try to access/create our database
    const youtubeDb = client.db('youtube-clone');
    
    // Create a test collection if it doesn't exist
    const collections = await youtubeDb.listCollections().toArray();
    console.log('\n📁 Collections in youtube-clone:');
    if (collections.length === 0) {
      console.log('   No collections yet');
      await youtubeDb.createCollection('test_collection');
      console.log('Created test_collection');
    } else {
      collections.forEach(coll => {
        console.log(`   - ${coll.name}`);
      });
    }

    // Insert a test document
    const testDoc = {
      message: 'YouTube Clone Test',
      timestamp: new Date(),
      status: 'active'
    };
    
    const result = await youtubeDb.collection('test_collection').insertOne(testDoc);
    console.log(`Inserted test document with ID: ${result.insertedId}`);

    // Count documents
    const count = await youtubeDb.collection('test_collection').countDocuments();
    console.log(`Total documents in test_collection: ${count}`);

    // Clean up
    await youtubeDb.collection('test_collection').deleteMany({});
    console.log('Cleaned up test documents');

  } catch (error) {
    console.error('\n Connection Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Name:', error.name);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\nAUTHENTICATION ERROR - Possible issues:');
      console.log('Username is incorrect');
      console.log('Password is incorrect');
      console.log('Database user doesn\'t have permissions');
      console.log('IP address not whitelisted');
      
      console.log('\n How to fix:');
      console.log('Go to MongoDB Atlas → Database Access');
      console.log('Find user "youtube_user"');
      console.log('Click "Edit" → "Edit Password"');
      console.log('Set new password and copy it');
      console.log('Update .env file with new password');
      console.log('Go to Network Access → Add IP Address → Allow Access from Anywhere');
    }
    
    if (error.message.includes('querySrv')) {
      console.log('\n DNS ERROR:');
      console.log('Try changing DNS to 8.8.8.8 (Google DNS)');
    }

  } finally {
    await client.close();
    console.log('\n Connection closed');
  }
}

testConnection();