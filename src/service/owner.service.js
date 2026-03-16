import { Owner } from "../models/owner.model.js";



export const findOwner = async (condition) => {
  const user = await Owner.findOne(condition);

  if (!user) {
    return {
      success: false,
      message: "No user exist with this detail",
      data: null,
    };
  }

  return {
    success: true,
    message: "User already exists",
    data: user,
  };
};

export const registerOwner = async (createUser) => {
  const user = await Owner.create(createUser);

  if (!user) {
    return {
      success: false,
      message: "User not created",
      data: null,
    };
  }

  return {
    success: true,
    message: "User created successfully",
    data: user,
  };
};

