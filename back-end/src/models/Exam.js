import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    description: {
      en: { type: String, default: '' },
      hi: { type: String, default: '' },
    },
    conductingBody: {
      type: String,
      default: '',
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    totalMockTests: {
      type: Number,
      default: 0,
    },
    stages: [
      {
        name: String,
        marks: Number,
        durationMinutes: Number,
        negativeMarking: Number,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Exam = mongoose.model('Exam', examSchema);

