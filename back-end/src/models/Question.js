import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      index: true,
    },
    exam: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      index: true,
    },
    question: {
      en: { type: String, required: true },
      hi: { type: String, default: '' },
    },
    options: [
      {
        en: { type: String, required: true },
        hi: { type: String, default: '' },
      },
    ],
    correct: {
      type: Number, // 0-indexed (0, 1, 2, 3)
      required: true,
    },
    explanation: {
      en: { type: String, default: '' },
      hi: { type: String, default: '' },
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
      index: true,
    },
    year: {
      type: Number,
      default: null,
    },
    source: {
      type: String,
      default: '',
    },
    tags: [String],
    reportsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound indexes for multi-field filtering
questionSchema.index({ category: 1, exam: 1, difficulty: 1 });
questionSchema.index({ category: 1, exam: 1, subject: 1 });
questionSchema.index({ exam: 1, subject: 1, topic: 1 });

export const Question = mongoose.model('Question', questionSchema);
