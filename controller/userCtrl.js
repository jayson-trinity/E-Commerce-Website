const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongodbid } = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require ('jsonwebtoken');
const sendEmail = require("./emailCtrl");
const crypto = require ('crypto');

const createUser = asyncHandler(async (req, res) => { 
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("user already exists");
  }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordsMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    })
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("invalid credentials");
  }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) =>{
  const cookie = req.cookies;
  if(!cookie.refreshToken) throw new Error('no refresh token in cookies');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({refreshToken})
  if(!user) throw new Error ('no refresh token present in db or not matched');
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) =>{
    if(err || user.id !== decoded.id) {
      throw new Error ('there is something wrong with refresh token')
    }
    const accessToken = generateToken(user?._id)
    res.json({accessToken});
  })
})

//logout functionality

const logout = asyncHandler(async (req, res) =>{
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error ('No refresh token in cookies');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user){
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    })
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({refreshToken: refreshToken }, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
})

const updateaUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbid(id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json({ updateUser });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbid(id);
  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbid(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      deleteUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbid(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "user blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbid(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "user unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler (async (req, res) => {
  const {_id} = req.user;
  const {password} = req.body;
  validateMongodbid(_id);
  const user = await User.findById(_id);
  if (password){
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  }else {
    res.json(user);
  }
})

const forgotPasswordToken = asyncHandler (async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne ({email});
  if(!user) throw new Error ('user  not found with this mail');
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi, please follow this link to reset your password. This link is valid till 10 miniutes from now. <a href='http:localhost:8080/api/user/reset-password/${token}'>CLick Here<a>`
    const data = {
      to:email,
      text: 'Hey User',
      subject:'Forgot Password Link',
      html: resetUrl,
    }
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error (error)
  }
})

const resetPassword = asyncHandler( async (req, res) =>{
  const { password } = req.body;
  const {token} = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passswordResetExpire: {$gt: Date.now() },
  })
  if (!user) throw new Error ('token expired please try again later');
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
})

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getSingleUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
};
