const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    caseId: { 
      type: String, 
      unique: true, 
      index: true,
    },
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true,
    },
    description: String,
    linkedTickets: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ticket',
      },
    ],
    status: {
      type: String,
      enum: ['Open', 'Investigation', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    caseManagerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
    },
    assignedAgents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    milestones: [
      {
        title: String,
        description: String,
        dueDate: Date,
        completedDate: Date,
        status: { 
          type: String, 
          enum: ['Pending', 'In Progress', 'Completed'], 
          default: 'Pending',
        },
      },
    ],
    createdAt: { 
      type: Date, 
      default: Date.now,
      index: true,
    },
    updatedAt: { 
      type: Date, 
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-generate case ID
caseSchema.pre('save', async function () {
  if (this.isNew) {
    const count = await mongoose.model('Case').countDocuments();
    this.caseId = `CS${String(5000 + count + 1).padStart(5, '0')}`;
  }
});

module.exports = mongoose.model('Case', caseSchema);
