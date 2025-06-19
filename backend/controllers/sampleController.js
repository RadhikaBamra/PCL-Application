const Sample = require("../models/Sample");
const User = require("../models/User");
const notifyUser = require("../utils/notifyUser");

exports.submitSample = async (req, res) => {
  try {
    console.log(" Logged-in user at sample submission:", req.user);

    const { sampleCode, type, parameters, guestInfo, submittedBy, role } =
      req.body;

    if (!type)
      return res.status(400).json({ message: "Sample type is required" });

    const normalizedType = type.toLowerCase();
    const labMap = {
      soil: "Soil Lab",
      water: "Water Lab",
      air: "Air Lab",
    };

    let assignedLab = labMap[normalizedType];
    if (parameters?.isToxic) assignedLab = "Quarantine Lab";
    if (!assignedLab)
      return res
        .status(400)
        .json({ message: "Invalid or unsupported sample type" });

    const newSample = new Sample({
      sampleCode,
      type: normalizedType,
      parameters,
      guestInfo,
      submittedBy: req.user?.email?.toLowerCase().trim(),
      role,
      assignedLab,
    });

    await newSample.save();

    const notifications = [];

    if (guestInfo?.email) {
      notifications.push(
        notifyUser({
          recipientEmail: guestInfo.email,
          subject: "Sample Submitted Successfully",
          message: `Hi ${guestInfo.name}, your sample (${sampleCode}) has been submitted and assigned to ${assignedLab}.`,
          sampleId: newSample._id,
        })
      );
    }

    if (req.user) {
      notifications.push(
        notifyUser({
          recipientId: req.user._id,
          recipientEmail: req.user.email,
          subject: "Sample Submitted",
          message: `Hi ${
            req.user.fullName
          }, you submitted a sample (${sampleCode})${
            guestInfo?.name ? ` on behalf of ${guestInfo.name}` : ""
          }, assigned to ${assignedLab}.`,
          sampleId: newSample._id,
        })
      );
    }

    await Promise.all(notifications);
    res.status(201).json({ message: "Sample submitted", sampleCode });
  } catch (err) {
    console.error("Error submitting sample:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMySamples = async (req, res) => {
  try {
    const user = req.user;
    const samples = await Sample.find({
      submittedBy: user.email,
    });
    res.status(200).json(samples);
  } catch (error) {
    console.error("Error fetching user's samples:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllSamples = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const samples = await Sample.find(filter);
    res.json(samples);
  } catch (err) {
    console.error("Error fetching all samples:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSampleStatus = async (req, res) => {
  try {
    const sampleId = req.params.id;
    const { status } = req.body;
    const file = req.file;

    const sample = await Sample.findById(sampleId);
    if (!sample) return res.status(404).json({ message: "Sample not found" });

    if (status && typeof status === "string" && status.trim()) {
      sample.status = status.trim();
    }

    if (file) {
      sample.report = `uploads/${file.filename}`;
    }

    sample.updatedAt = new Date();
    await sample.save();

    const notifications = [];

    if (sample.role === "guest" && sample.guestInfo?.email) {
      notifications.push(
        notifyUser({
          recipientEmail: sample.guestInfo.email,
          subject: "Sample Status Updated",
          message: `Hello ${sample.guestInfo.name}, your sample (${sample.sampleCode}) status is now: ${sample.status}.`,
          sampleId: sample._id,
        })
      );
    } else {
      const user = await User.findOne({ email: sample.submittedBy });
      if (user) {
        notifications.push(
          notifyUser({
            recipientId: user._id,
            recipientEmail: user.email,
            subject: "Sample Status Updated",
            message: `Hello ${user.fullName}, your sample (${sample.sampleCode}) status is now: ${sample.status}.`,
            sampleId: sample._id,
          })
        );
      }
    }

    await Promise.all(notifications);
    res.json({ message: "Sample updated successfully" });
  } catch (err) {
    console.error("🔥 Server Error in updateSampleStatus:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateAssignedLab = async (req, res) => {
  try {
    const sampleId = req.params.id;
    const { assignedLab } = req.body;

    if (!assignedLab || typeof assignedLab !== "string") {
      return res.status(400).json({ message: "Invalid assigned lab" });
    }

    const sample = await Sample.findById(sampleId);
    if (!sample) return res.status(404).json({ message: "Sample not found" });

    sample.assignedLab = assignedLab;
    sample.updatedAt = new Date();
    await sample.save();

    res.json({ message: "Assigned lab updated successfully" });
  } catch (err) {
    console.error("Error updating assigned lab:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSample = async (req, res) => {
  try {
    const sampleId = req.params.id;
    const sample = await Sample.findById(sampleId);
    if (!sample) return res.status(404).json({ message: "Sample not found" });

    if (sample.report) {
      const reportPath = path.join(__dirname, "..", "uploads", sample.report);
      fs.unlink(reportPath, (err) => {
        if (err) {
          console.error("⚠️ Failed to delete report file:", err.message);
        } else {
          console.log("✅ Report file deleted:", sample.report);
        }
      });
    }

    await Sample.deleteOne({ _id: sampleId });
    res.json({ message: "Sample deleted" });
  } catch (err) {
    console.error("Error deleting sample:", err);
    res.status(500).json({ message: "Server error!" });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const allSamples = await Sample.find().sort({ createdAt: -1 });

    const totalSamples = allSamples.length;
    const finishedSamples = allSamples.filter(
      (s) => s.status === "finished analysing"
    ).length;
    const pendingSamples = allSamples.filter(
      (s) => s.status === "pending"
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const samplesToday = allSamples.filter(
      (s) => s.createdAt && new Date(s.createdAt) >= today
    ).length;

    const sampleTypeBreakdown = {};
    const toxicBreakdown = { toxic: 0, nonToxic: 0 };
    const toxicTypeBreakdown = {};
    const statusBreakdown = {};
    const samplesPerUserMap = {};
    const samplesOverTimeMap = {};

    for (const sample of allSamples) {
      if (sample.type) {
        sampleTypeBreakdown[sample.type] =
          (sampleTypeBreakdown[sample.type] || 0) + 1;
      }

      const isToxic = sample.parameters?.isToxic;
      if (typeof isToxic === "boolean") {
        if (isToxic) {
          toxicBreakdown.toxic += 1;
          toxicTypeBreakdown[sample.type] =
            (toxicTypeBreakdown[sample.type] || 0) + 1;
        } else {
          toxicBreakdown.nonToxic += 1;
        }
      }

      if (sample.status) {
        statusBreakdown[sample.status] =
          (statusBreakdown[sample.status] || 0) + 1;
      }

      if (sample.submittedBy) {
        samplesPerUserMap[sample.submittedBy] =
          (samplesPerUserMap[sample.submittedBy] || 0) + 1;
      }

      const dateKey = sample.createdAt?.toISOString().split("T")[0];
      if (dateKey) {
        samplesOverTimeMap[dateKey] = (samplesOverTimeMap[dateKey] || 0) + 1;
      }
    }

    const samplesPerUser = Object.entries(samplesPerUserMap).map(
      ([email, count]) => ({ email, count })
    );
    const topContributors = samplesPerUser
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const samplesOverTime = Object.entries(samplesOverTimeMap)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, count]) => ({ date, count }));

    const recentFinishedSamples = allSamples
      .filter((s) => s.status === "finished analysing")
      .slice(0, 5)
      .map((s) => ({
        sampleCode: s.sampleCode,
        type: s.type,
        submittedBy: s.submittedBy,
        submittedOn: s.createdAt,
      }));

    res.json({
      totalSamples,
      finishedSamples,
      pendingSamples,
      samplesToday,
      sampleTypeBreakdown,
      toxicBreakdown,
      toxicTypeBreakdown,
      statusBreakdown,
      samplesPerUser,
      samplesOverTime,
      recentFinishedSamples,
      topContributors,
    });
  } catch (err) {
    console.error("Error generating dashboard stats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
