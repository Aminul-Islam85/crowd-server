import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: Number, required: true },
    minDonation: { type: Number, required: true },
    deadline: { type: Date, required: true },
    image: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },

    // ADD THIS PART for storing donations
    donations: [
      {
        amount: { type: Number, required: true },
        donorName: { type: String, required: true },
        donorEmail: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);
export default Campaign;
