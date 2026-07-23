import User from '../models/user.model.js';

export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: "EMPLOYEE",
    })
      .select("_id name email")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};