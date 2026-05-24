const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    ticketId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Ticket', 
      required: true,
      index: true,
    },
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
    },
    message: { 
      type: String, 
      required: [true, 'Message is required'],
      trim: true,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    isInternal: { 
      type: Boolean, 
      default: false,
      index: true,
    },
    createdAt: { 
      type: Date, 
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
