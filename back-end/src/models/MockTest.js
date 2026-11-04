import mongoose from 'mongoose';

const mockTestSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      hi: { type: String, default: '' },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
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
    type: {
      type: String,
      enum: ['full', 'sectional', 'topic', 'pyq', 'daily'],
      default: 'full',
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    markPerQuestion: {
      type: Number,
      default: 1,
    },
    negativeMarking: {
      type: Number,
      default: 0.33,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    sections: [
      {
        name: String,
        questionCount: Number,
      },
    ],
    isFree: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MockTest = mongoose.model('MockTest', mockTestSchema);

