import { Request, Response } from "express";
import User from "../../models/User";
import admin from "../../firebase";

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, lastname, phone, address, isAdmin } =
      req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: "El correo electrónico y la contraseña son requeridos" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: "La contraseña debe tener al menos 6 caracteres" 
      });
    }

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
      isAdmin: isAdmin || false,
    });
    await user.save();

    res
      .status(201)
      .json({ "Usuario creado": user, "Registro de usuario": userRecord });
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Errores de Firebase Auth
    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ 
        error: "Este correo electrónico ya está registrado. Por favor inicia sesión o usa otro correo." 
      });
    }
    
    if (error.code === "auth/invalid-email") {
      return res.status(400).json({ 
        error: "El formato del correo electrónico no es válido" 
      });
    }
    
    if (error.code === "auth/weak-password") {
      return res.status(400).json({ 
        error: "La contraseña es muy débil. Debe tener al menos 6 caracteres" 
      });
    }

    if (error.code === "auth/invalid-password") {
      return res.status(400).json({ 
        error: "La contraseña no es válida. Debe tener al menos 6 caracteres" 
      });
    }

    // Errores de MongoDB
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        error: "Error de validación en los datos proporcionados" 
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ 
        error: "Este usuario ya existe en el sistema" 
      });
    }

    // Error genérico
    res.status(500).json({ 
      error: "Ocurrió un error al crear tu cuenta. Por favor intenta de nuevo más tarde." 
    });
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
      isAdmin: false,
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
    const { name, lastname, phone, address, isAdmin } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;

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
  getAllUsers,
  getUserById,
  updateUser,
  hardDeleteUser,
  softDeleteUser,
};
