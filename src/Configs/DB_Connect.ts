import mongoose, { MongooseError } from 'mongoose';

const options = {
  autoIndex: true, //this is the code I added that solved it all
  keepAlive: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4, skip trying IPv6
};

const isEnvProduction = process.env.NODE_ENV === 'production';
const urlDatabase = isEnvProduction ? process.env.DATABASE : process.env.DATABASE_LOCAL;
const urlDatabasePassword = isEnvProduction ? process.env.DATABASE_PASSWORD : process.env.DATABASE_PASSWORD_LOCAL;
const urlDatabaseEncode = isEnvProduction ? urlDatabase.replace('PASSWORD', encodeURIComponent(urlDatabasePassword)) : urlDatabase;

mongoose
  .connect(urlDatabaseEncode, options)
  .then(() => {
    console.log('Connect to MongoDB');
  })
  .catch((err: MongooseError) => console.log(err));
