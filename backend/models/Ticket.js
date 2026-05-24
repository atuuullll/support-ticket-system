const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { 
      type: String, 
      unique: true, 
      index: true,
    },
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true,
    },
    description: { 
      type: String, 
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['Billing', 'Technical', 'Account', 'Refund', 'Security', 'Other'],
      default: 'Technical',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'],
      default: 'Open',
      index: true,
    },
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true,
    },
    agentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      index: true,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    internalNotes: [
      {
        note: String,
        createdBy: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User',
        },
        createdAt: { 
          type: Date, 
          default: Date.now,
        },
      },
    ],
    tags: [String],
    createdAt: { 
      type: Date, 
      default: Date.now,
      index: true,
    },
    updatedAt: { 
      type: Date, 
      default: Date.now,
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);

// Auto-generate ticket ID
ticketSchema.pre('save', async function () {
  if (this.isNew) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketId = `TK${String(1000 + count + 1).padStart(5, '0')}`;
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
