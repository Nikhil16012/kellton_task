const { getUserProfile, updateUserProfile } = require("../services/userService");

const getProfile = async (req, res, next) => {
  try {
    const profile = await getUserProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updated = await updateUserProfile(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile };