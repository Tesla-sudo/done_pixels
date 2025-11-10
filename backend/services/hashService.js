//services/hashService.js

const bcrypt = require("bcryptjs");

//Function to hash a password
exports.hashPassword = async (plainPassword) => {
    //bcrypt.hash generates a hashed version of the password
    //The number 10 is the salt rounds, which affects the complexity of the hash
    return await bcrypt.hash(plainPassword, 10);
};

//Function to compare a plain password with a hashed password
exports.comparePassword = async (plainPassword, hashedPassword) => {
    //bcrypt.compare checks if the plain password matches the hashed password
    return await bcrypt.compare(plainPassword, hashedPassword);
}