import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  unlockedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    achievementId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '🏆',
    },
    threshold: {
      type: Number,
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ userId: 1 });
achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);
export default Achievement;
