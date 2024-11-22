import { set, connect } from 'mongoose';

export const connectToDatabase = async () => {
    try {
        set("strictQuery", false);
        const conn = await connect(process.env.MONGO_URL, { dbName: process.env.DB });
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch (err) {
        console.log(err.message)
        process.exit(1);
    }
}