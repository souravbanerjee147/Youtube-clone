import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Connected: ${conn.connection.host}`);

        // Check if indexes exist
        const collections = await mongoose.connection.db.collections();
        console.log(`collections: ${collections.length}`);

        return conn;
    } catch (error) {
        console.error(`Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;