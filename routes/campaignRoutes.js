import express from "express";
import Campaign from "../models/Campaign.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();

    res.status(201).json({ message: "Campaign created successfully!", campaign });
  } catch (error) {
    
    res.status(500).json({ message: "Server error, failed to add campaign.", error: error.message });
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    
    if (campaign.userEmail !== req.body.userEmail) {
      return res.status(403).json({ message: "You can only edit your own campaigns" });
    }

    
    Object.assign(campaign, req.body);
    await campaign.save();

    res.status(200).json({ message: "Campaign updated successfully!", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to update campaign", error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    
    if (campaign.userEmail !== req.body.userEmail) {
      return res.status(403).json({ message: "You can only delete your own campaigns" });
    }

    await campaign.deleteOne();
    res.status(200).json({ message: "Campaign deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to delete campaign", error: error.message });
  }
});




router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving campaigns", error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    console.log(`Fetching campaign with ID: ${req.params.id}`);
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    
    res.json(campaign);
  } catch (error) {
    console.error("Error retrieving campaign:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/user/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    

    const campaigns = await Campaign.find({ userEmail });

    
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching user campaigns:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.post("/:id/donate", async (req, res) => {
  try {
    const { amount, donorName, donorEmail } = req.body;
    

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      
      return res.status(404).json({ message: "Campaign not found" });
    }

    
    if (!amount || !donorName || !donorEmail) {
      
      return res.status(400).json({ message: "All fields are required (amount, donorName, donorEmail)" });
    }

    
    campaign.donations.push({ amount, donorName, donorEmail, date: new Date() });
    await campaign.save();

    
    res.status(201).json({ message: "Donation added successfully!", campaign });
  } catch (error) {
    console.error("Error adding donation:", error.message);
    res.status(500).json({ message: "Server error, failed to add donation.", error: error.message });
  }
});


router.get("/donations/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    

    
    const campaigns = await Campaign.find({ "donations.donorEmail": userEmail });

    
    const userDonations = campaigns.flatMap((campaign) =>
      campaign.donations
        .filter((donation) => donation.donorEmail === userEmail)
        .map((donation) => ({
          campaignTitle: campaign.title,
          amount: donation.amount,
          date: donation.date,
        }))
    );

    
    res.json(userDonations);
  } catch (error) {
    
    res.status(500).json({ message: "Server error, failed to retrieve donations.", error: error.message });
  }
});

export default router;
