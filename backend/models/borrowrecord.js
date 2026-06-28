import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(
{
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item",
        required:true
    },

    borrower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    borrowDate:{
        type:Date,
        default:Date.now
    },

    expectedReturnDate:{
        type:Date,
        required:true
    },

    actualReturnDate:{
        type:Date
    },

    status:{
        type:String,
        enum:[
            "Pending",
            "Approved",
            "Borrowed",
            "Returned",
            "Cancelled"
        ],
        default:"Pending"
    },

    extensionRequested:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);
export default BorrowRecord;