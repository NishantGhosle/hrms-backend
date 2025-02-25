import bcrypt from 'bcryptjs';
bcrypt.hash(process.env.PASSWORD, 10).then(hash => console.log(hash));