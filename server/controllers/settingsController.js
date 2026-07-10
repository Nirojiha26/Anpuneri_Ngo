const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');
const ApiResponse = require('../utils/apiResponse');

const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.find({ isPublic: true });
  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
  return ApiResponse.success(res, { settings: settingsMap });
});

const adminGetSettings = asyncHandler(async (req, res) => {
  const { group } = req.query;
  const filter = {};
  if (group) filter.group = group;

  const settings = await Settings.find(filter).sort({ group: 1, key: 1 });
  return ApiResponse.success(res, { settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body;

  const operations = settings.map(({ key, value }) =>
    Settings.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true, runValidators: true }
    )
  );

  await Promise.all(operations);
  return ApiResponse.success(res, {}, 'Settings updated successfully');
});

const updateSingleSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  const setting = await Settings.findOneAndUpdate(
    { key },
    { value },
    { new: true, upsert: true }
  );

  return ApiResponse.success(res, { setting }, 'Setting updated');
});

module.exports = { getPublicSettings, adminGetSettings, updateSettings, updateSingleSetting };
