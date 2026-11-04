import mongoose from 'mongoose';

const questionSubmissionSchema = new mongoose.Schema(
  {
    contributorName: {
      type: String,
      required: [true, 'Contributor name is required'],
      trim: true,
    },
    contributorEmail: {
      type: String,
      required: [true, 'Contributor email is required'],
      trim: true,
      lowercase: true,
    },
    contributorPhone: {
      type: String,
      trim: true,
      default: '',
    },
    exam: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
      default: 'General',
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2,
        message: 'At least 2 options are required',
      },
      required: true,
    },
    correctAnswer: {
      type: String,
      required: [true, 'Correct option/answer is required'],
      trim: true,
    },
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('QuestionSubmission', questionSubmissionSchema);
