const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const UserSchema = new mongoose.Schema({ email: String, name: String }, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'ali@gmail.com' });
        if (user) {
            console.log("Instructor ID Found:", user._id.toString());
            fs.writeFileSync('instructor_id.txt', user._id.toString());
        } else {
            console.log("Instructor not found");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};
run();
