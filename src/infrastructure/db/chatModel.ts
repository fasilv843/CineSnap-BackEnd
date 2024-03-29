import mongoose, { Model, Schema } from "mongoose";
import { IChatHistory } from "../../application/interfaces/types/chat";


export const chatSchema: Schema = new Schema<IChatHistory & Document>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        // required: true
        validate: function (this: IChatHistory) {
            return validateParticipants(this.userId, this.theaterId, this.adminId)
        },
    },
    theaterId: {
        type: Schema.Types.ObjectId,
        ref: 'Theaters',
        // required: true
        validate: function (this: IChatHistory) {
            return validateParticipants(this.userId, this.theaterId, this.adminId)
        },
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        validate: function (this: IChatHistory) {
            return validateParticipants(this.userId, this.theaterId, this.adminId)
        },
    },
    messages: [{
        sender: {
            type: String,
            enum: ['User', 'Theater', 'Admin'],
            required: true
        },
        message: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            default: Date.now,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false,
            required: true
        }
    }]
},
{
    timestamps: true
})

// Compound index to ensure uniqueness of userId, theaterId, and adminId
chatSchema.index({ userId: 1, theaterId: 1, adminId: 1 }, { unique: true });

// Custom validation function
function validateParticipants(userId: string | undefined, theaterId: string | undefined, adminId: string | undefined) {
    const fieldsCount = [userId, theaterId, adminId].filter(Boolean).length;
    // console.log('validating, count == 2', fieldsCount);
    
    return fieldsCount === 2;
}

export const chatModel: Model<IChatHistory & Document> = mongoose.model<IChatHistory & Document>('Chats', chatSchema)