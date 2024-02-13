import jwt from 'jsonwebtoken';
import rdata from '../coll.js';

const usersResolver = {
    Query: {
        TotalUsers: async (_,{input}) => {
            try{
                const {roomid} = input;
                const Users = await rdata.findOne({roomid:roomid});
                return Users;
            }
            catch(err){
                return console.log(err);
            }
        }
    },
    Mutation: {
        AddUser: async (_, { input }) => {
            const { roomid,username } = input;
            const existingroom = await rdata.findOne({ roomid: roomid });
            const existingnameroom = await rdata.findOne({ $and: [{ roomid: roomid }, { 'username': username }] });
            if (existingnameroom) {
                try {
                } catch (error) {
                    return res.status(500).json({ error: 'Server error' });
                }
            }
            else if (existingroom) {
                existingroom.username.push(username);
                try {
                    const savedEntry = await existingroom.save();
                } catch (error) {
                    return res.status(500).json({ error: 'Server error' });
                }
            }
            else {
                const newRoom = new rdata({
                    roomid: roomid,
                    username: [username],
                });
                try {
                    const savedRoom = await newRoom.save();
                } catch (error) {
                    return res.status(500).json({ error: 'Server error' });
                }
            }

            const token = jwt.sign({ username }, '123', { expiresIn: '10h' });
            return { token };
        },
    },
}

export default usersResolver;  