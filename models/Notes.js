const mongoose = require('mongoose');
const User = require('./User');

const notesSchema = new mongoose.Schema({
    user_id :{
        //type:String
        type:mongoose.SchemaTypes.ObjectId,
        //ref:'User'

    } ,
    note_title :String,
    note:String,
    noteNumber:{ type: Number, unique: true },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    },
    updatedAt:{
        type:Date,
        required:true,
        default: Date.now
    }

})




notesSchema.pre('save', async function (next) {
    if (!this.noteNumber) {
        try {
            const lastNote = await this.constructor.findOne({}, 'noteNumber', { sort: { noteNumber: -1 } });
            this.noteNumber = lastNote ? lastNote.noteNumber + 1 : 1;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('Notes',notesSchema);