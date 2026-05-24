const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    ticketId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Ticket', 
      required: true,
      index: true,
    },
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true,
    },
    rating: { 
      type: Number, 
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      required: [true, 'Rating is required'],
    },
    review: {
      type: String,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
    createdAt: { 
      type: Date, 
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
