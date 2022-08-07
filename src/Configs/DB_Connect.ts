import mongoose, { MongooseError } from 'mongoose';

const options = {
  autoIndex: true, //this is the code I added that solved it all
  keepAlive: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
};

mongoose
  .connect(process.env.DATABASE_LOCAL, options)
  .then(() => {
    console.log('Connect to MongoDB');
  })
  .catch((err: MongooseError) => console.log(err));
