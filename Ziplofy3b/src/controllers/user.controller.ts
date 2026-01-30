import { Request, Response } from "express";
import { IUser, User } from "../models/user.model";
import { asyncErrorHandler, CustomError } from "../utils/error.utils";


export const createUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, status } = req.body as Pick<IUser, "name" | "email" | "password" | "role" | "status">;

  const user = await User.create({
    name,
    email,
    password,
    role,
    status: "active"
  });

  // Remove password from response
  const userResponse = await User.findById(user._id).select("-password");

  res.status(201).json({
    success: true,
    data: userResponse,
  });
});

interface GetUsersQuery {
  search?: string;
  role?: string;
  status?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

export const getUsers = asyncErrorHandler(async (req: Request, res: Response) => {
  const {
    search,
    role,
    status,
    page = "1",
    limit = "10",
    sort = "createdAt",
  } = req.query as GetUsersQuery;

  // Build filter object
  const filter: any = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role && role !== "all") {
    filter.role = role;
  }

  if (status && status !== "all") {
    filter.status = status;
  }

  // Execute query with pagination
  const users = await User.find(filter)
    .select("-password")
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort(sort === "newest" ? { createdAt: -1 } : { createdAt: 1 });

  // Get total documents count
  const count = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: users,
    totalPages: Math.ceil(count / parseInt(limit)),
    currentPage: parseInt(page),
    total: count,
  });
});

interface GetUserParams {
  id: string;
}

export const getUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as GetUserParams;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

interface UpdateUserParams {
  id: string;
}


export const updateUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as UpdateUserParams;
  const { name, email, role, status } = req.body as Pick<IUser, "name" | "email" | "role" | "status">;

  const user = await User.findByIdAndUpdate(
    id,
    { name, email, role, status, updatedAt: new Date() },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

interface DeleteUserParams {
  id: string;
}

export const deleteUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as DeleteUserParams;

  // Prevent super-admin from deleting themselves
  if (id === req.user?.id) {
    throw new CustomError("You cannot delete your own account", 400);
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

