import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    ipHash: {
      type: String,
      default: '',
      index: true,
    },
    path: {
      type: String,
      default: '/',
    },
    userAgent: {
      type: String,
      default: '',
    },
    referrer: {
      type: String,
      default: '',
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'desktop',
    },
    visitDate: {
      type: String, // YYYY-MM-DD for fast aggregation
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

visitorSchema.index({ visitDate: 1, path: 1 });

export const Visitor = mongoose.model('Visitor', visitorSchema);

