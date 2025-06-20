const express = require("express");
const Sample = require("../models/Sample");
const router = express.Router();
const {
  submitSample,
  getMySamples,
  getAllSamples,
  updateSampleStatus,
  deleteSample,
  updateAssignedLab,
  getDashboardStats,
} = require("../controllers/sampleController");

const { authenticateUser, requireRole } = require("../middleware/auth");
const upload = require("../middleware/uploads");

router.post("/submit", authenticateUser, submitSample);

router.get("/mine", authenticateUser, getMySamples);

router.get(
  "/dashboard-stats",
  authenticateUser,
  requireRole(["admin", "scientist", "Admin", "Scientist"]),
  getDashboardStats
);

router.get("/my-finished-samples", authenticateUser, async (req, res) => {
  try {
    const finishedSamples = await Sample.find({
      submittedBy: req.user.email,
      status: "finished analysing",
    });
    res.json(finishedSamples);
  } catch (err) {
    console.error("Error fetching my finished samples:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/samples",
  authenticateUser,
  requireRole(["scientist", "admin"]),
  getAllSamples
);

router.get(
  "/:id",
  authenticateUser,
  requireRole(["scientist", "admin"]),
  async (req, res) => {
    try {
      const sample = await Sample.findById(req.params.id);
      if (!sample) return res.status(404).json({ message: "Sample not found" });
      res.json(sample);
    } catch (err) {
      console.error("Error fetching sample:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/:id/status",
  authenticateUser,
  requireRole(["scientist", "admin"]),
  upload.single("reportFile"),
  updateSampleStatus
);

router.put(
  "/:id/assign-lab",
  authenticateUser,
  requireRole(["admin", "scientist"]),
  updateAssignedLab
);

router.delete("/:id", authenticateUser, requireRole(["admin"]), deleteSample);

module.exports = router;
