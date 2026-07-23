const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');
const ApiResponse = require('../utils/apiResponse');
const { deleteFile } = require('../middlewares/upload');

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

  const operations = settings.map(async ({ key, value }) => {
    const oldSetting = await Settings.findOne({ key });
    if (oldSetting && oldSetting.value !== value && typeof oldSetting.value === 'string' && oldSetting.value.includes('cloudinary.com')) {
      await deleteFile(oldSetting.value);
    }
    
    return Settings.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true, runValidators: true }
    );
  });

  await Promise.all(operations);
  return ApiResponse.success(res, {}, 'Settings updated successfully');
});

const updateSingleSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  const oldSetting = await Settings.findOne({ key });
  if (oldSetting && oldSetting.value !== value && typeof oldSetting.value === 'string' && oldSetting.value.includes('cloudinary.com')) {
    await deleteFile(oldSetting.value);
  }

  const setting = await Settings.findOneAndUpdate(
    { key },
    { value },
    { new: true, upsert: true }
  );

  return ApiResponse.success(res, { setting }, 'Setting updated');
});

module.exports = { getPublicSettings, adminGetSettings, updateSettings, updateSingleSetting };
