import mongoose from "mongoose";

const connectDB = async () => {
    const tryConnect = async (uri) => {
        const conn = await mongoose.connect(uri, {
            // keep default mongoose options but allow overrides via MONGO_OPTIONS env if needed
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    };

    try {
        if (process.env.MONGO_URI) return await tryConnect(process.env.MONGO_URI);
    } catch (error) {
        console.error(`MongoDB connection failed (SRV): ${error.message}`);
    }

    // If SRV DNS resolution fails in this Node runtime, try a non-SRV URI if provided
    if (process.env.MONGO_URI_NON_SRV) {
        try {
            console.log('Attempting non-SRV MongoDB URI...');
            return await tryConnect(process.env.MONGO_URI_NON_SRV);
        } catch (err2) {
            console.error(`Non-SRV connection failed: ${err2.message}`);
        }
    }

    // As a last resort, try a local fallback (useful for development)
    if (process.env.MONGO_URI_FALLBACK) {
        try {
            console.log('Attempting fallback MongoDB URI...');
            return await tryConnect(process.env.MONGO_URI_FALLBACK);
        } catch (err3) {
            console.error(`Fallback connection failed: ${err3.message}`);
        }
    }

    console.log("MongoDB not connected.");
    return false;
};

export default connectDB;
