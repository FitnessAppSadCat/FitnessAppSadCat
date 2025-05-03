import User from "../src/models/UserModel.js";

async function findByEmail(email, includePassword = false) {
  if (!email) throw new Error("Email is required");
  if (includePassword) {
    return await User.findOne({ email }).select("+password");
  }
  return await User.findOne({ email });
}

async function getUserById(userId, includeRefreshToken = false) {
  if (!userId) throw new Error("User ID is required");
  if (includeRefreshToken) {
    return await User.findById(userId).select("+refreshToken");
  }
  return await User.findById(userId);
}

async function getAllUsers() {
  return await User.find({});
}

async function getUserByIdWithPassword(userId) {
  return await User.findById(userId).select("+password");
}

async function createUser(userData) {
  if (!userData) throw new Error("User data is required");
  const user = await User.create(userData);
  return user;
}

async function updateUser(userId, updateData) {
  if (!userId) throw new Error("User ID is required");
  if (!updateData) throw new Error("Update data is required");
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
  return user;
}

async function deleteUser(userId) {
  if (!userId) throw new Error("User ID is required");
  const user = await User.findByIdAndDelete(userId);
  return user;
}

export {
  findByEmail,
  getUserById,
  getAllUsers,
  getUserByIdWithPassword,
  createUser,
  updateUser,
  deleteUser,
};
