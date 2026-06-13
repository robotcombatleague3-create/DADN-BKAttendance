const ClassModel = require('../models/ClassModel');

exports.getAllClasses = async (req, res) => {
  const classes = await ClassModel.getAllClasses();
  res.json({ success: true, data: classes });
};
