import Feedback from '../models/Feedback.js';
import Issue from '../models/issue.js';
export const submitFeedback = async (req, res) => {
  try {
    const citizenId = req.citizen._id;
    const { issueId, rating, comment } = req.body;

    // Check if the issue belongs to the citizen
    const issue = await Issue.findById(issueId);
    if (!issue || issue.citizen.toString() !== citizenId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to give feedback on this issue' });
    }

    const existing = await Feedback.findOne({ citizen: citizenId, issue: issueId });
    if (existing) {
      return res.status(400).json({ message: 'Feedback already submitted for this issue' });
    }
    const newFeedback = new Feedback({
      citizen: citizenId,
      issue: issueId,
      rating,
      comment
    });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
};
export const getSectorWiseRatings = async (req, res) => {
  try {
    const ratings = await Feedback.aggregate([
      {
        $lookup: {
          from: "citizens",
          localField: "citizen",
          foreignField: "_id",
          as: "citizenInfo"
        }
      },
      { $unwind: "$citizenInfo" },
      {
        $group: {
          _id: "$citizenInfo.sector",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching sector-wise ratings:", error);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};