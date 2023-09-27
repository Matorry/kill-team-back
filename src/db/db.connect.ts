import mongoose from 'mongoose';

export const dbConnect = () => {
  const user = process.env.DB_USER;
  const passwd = process.env.DB_PASSWD;
  const uri = `mongodb+srv://${user}:${passwd}@cluster0.kwgkdev.mongodb.net/killteam?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
