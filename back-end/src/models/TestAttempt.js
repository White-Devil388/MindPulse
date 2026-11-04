import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockTest',
    },
    testSlug: {
      type: String,
      default: '',
    },
    testTitle: {
      type: String,
      default: '',
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    wrongCount: {
      type: Number,
      default: 0,
    },
    skippedCount: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Map,
      of: Number, // questionId -> selectedOptionIndex
      default: {},
    },
    topicBreakdown: [
      {
        topic: String,
        correct: Number,
        total: Number,
        accuracy: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);

