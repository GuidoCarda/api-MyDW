import { Request, Response } from "express";
import User from "../../models/User";
import admin from "../../firebase";

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, lastname, phone, address } = req.body;
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const user = new User({
      _id: userRecord.uid,
      name,
      lastname,
      email,
      phone,
      address,
      isActive: true,
    });
    await user.save();

    res
      .status(201)
      .json({ "Usuario creado": user, "Registro de usuario": userRecord });
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user", details: error });
  }
};

const loginWithEmailPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userRecord = await admin.auth().getUserByEmail(email);

    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    // Here you would normally verify the password.
    // Firebase Admin SDK does not provide password verification.
    // This is a placeholder for actual password verification logic.
    const isValidPassword = true; // Replace with real password check

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res
      .status(200)
      .json({ message: "Login with email and password successful." });
  } catch (error) {
    res.status(500).json({ error: "Failed to login", details: error });
  }
};

const createGoogleUser = async (req: Request, res: Response) => {
  try {
    const { uid, email } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: "UID and email are required" });
    }

    // Check if user already exists
    const existingUser = await User.findById(uid);
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // Create new user in MongoDB
    const user = new User({
      _id: uid,
      email,
      isActive: true,
    });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating Google user:", error);
    res.status(500).json({ error: "Failed to create user", details: error });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, lastname, phone, address } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

const hardDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { isActive: false });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to soft delete user" });
  }
};

export default {
  createUser,
  createGoogleUser,
  loginWithEmailPassword,
  getAllUsers,
  getUserById,
  updateUser,
  hardDeleteUser,
  softDeleteUser,
};
