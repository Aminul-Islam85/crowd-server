import express from "express";
import Campaign from "../models/Campaign.js";

const router = express.Router();

// ✅ Add New Campaign
router.post("/", async (req, res) => {
  try {
    console.log("📌 Creating a new campaign:", req.body);

    const campaign = new Campaign(req.body);
    await campaign.save();

    console.log("✅ Campaign created successfully:", campaign);
    res.status(201).json({ message: "Campaign created successfully!", campaign });
  } catch (error) {
    console.error("❌ Error adding campaign:", error.message);
    res.status(500).json({ message: "Server error, failed to add campaign.", error: error.message });
  }
});

// ✅ Edit Campaign (Only Owner)
router.patch("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Ensure only the owner can edit
    if (campaign.userEmail !== req.body.userEmail) {
      return res.status(403).json({ message: "You can only edit your own campaigns" });
    }

    // Update campaign details
    Object.assign(campaign, req.body);
    await campaign.save();

    res.status(200).json({ message: "Campaign updated successfully!", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to update campaign", error: error.message });
  }
});

// ✅ Delete Campaign (Only Owner)
router.delete("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Ensure only the owner can delete
    if (campaign.userEmail !== req.body.userEmail) {
      return res.status(403).json({ message: "You can only delete your own campaigns" });
    }

    await campaign.deleteOne();
    res.status(200).json({ message: "Campaign deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to delete campaign", error: error.message });
  }
});



// ✅ Get All Campaigns
router.get("/", async (req, res) => {
  try {
    console.log("📌 Fetching all campaigns...");
    const campaigns = await Campaign.find();
    
    console.log(`✅ Retrieved ${campaigns.length} campaigns`);
    res.json(campaigns);
  } catch (error) {
    console.error("❌ Error retrieving campaigns:", error.message);
    res.status(500).json({ message: "Error retrieving campaigns", error: error.message });
  }
});

// ✅ Get a Single Campaign by ID
router.get("/:id", async (req, res) => {
  try {
    console.log(`📌 Fetching campaign with ID: ${req.params.id}`);
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      console.log("❌ Campaign not found");
      return res.status(404).json({ message: "Campaign not found" });
    }

    console.log("✅ Campaign found:", campaign.title);
    res.json(campaign);
  } catch (error) {
    console.error("❌ Error retrieving campaign:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Fetch Campaigns by User Email
router.get("/user/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    console.log(`📌 Fetching campaigns for user: ${userEmail}`);

    const campaigns = await Campaign.find({ userEmail });

    console.log(`✅ Campaigns found: ${campaigns.length}`);
    res.json(campaigns);
  } catch (error) {
    console.error("❌ Error fetching user campaigns:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Add a Donation to a Campaign
router.post("/:id/donate", async (req, res) => {
  try {
    const { amount, donorName, donorEmail } = req.body;
    console.log("🔹 Incoming donation data:", req.body);

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      console.log("❌ Campaign not found");
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Ensure all required fields are provided
    if (!amount || !donorName || !donorEmail) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "All fields are required (amount, donorName, donorEmail)" });
    }

    // Add the new donation
    campaign.donations.push({ amount, donorName, donorEmail, date: new Date() });
    await campaign.save();

    console.log("✅ Donation added successfully!");
    res.status(201).json({ message: "Donation added successfully!", campaign });
  } catch (error) {
    console.error("❌ Error adding donation:", error.message);
    res.status(500).json({ message: "Server error, failed to add donation.", error: error.message });
  }
});

// ✅ Fetch Donations Made by a Specific User
router.get("/donations/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    console.log(`📌 Fetching all donations made by user: ${userEmail}`);

    // Find all campaigns where this user has made a donation
    const campaigns = await Campaign.find({ "donations.donorEmail": userEmail });

    // Extract the user's donations from those campaigns
    const userDonations = campaigns.flatMap((campaign) =>
      campaign.donations
        .filter((donation) => donation.donorEmail === userEmail)
        .map((donation) => ({
          campaignTitle: campaign.title,
          amount: donation.amount,
          date: donation.date,
        }))
    );

    console.log(`✅ Retrieved ${userDonations.length} donations for user ${userEmail}`);
    res.json(userDonations);
  } catch (error) {
    console.error("❌ Error retrieving donations:", error.message);
    res.status(500).json({ message: "Server error, failed to retrieve donations.", error: error.message });
  }
});

export default router;
