import { Request, Response } from "express";
import Pet from "../../models/Pet";
import User from "../../models/User";

const createPet = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      birthDate,
      gender,
      breed,
      color,
      isCastrated,
      ownerId,
      photos,
      medicalInformation,
      temperament,
    } = req.body;

    const userExists = await User.findById(ownerId);

    if (!userExists) {
      return res.status(404).json({
        error: "Owner not found",
        message: "The specified user ID does not exist",
        providedId: ownerId,
      });
    }

    // Validar que el usuario esté activo
    if (!userExists.isActive) {
      return res.status(400).json({
        error: "Inactive user",
        message: "Cannot create pet for an inactive user",
      });
    }

    const pet = new Pet({
      name,
      description,
      birthDate,
      gender,
      breed,
      color,
      isCastrated,
      owner: ownerId,
      photos,
      medicalInformation,
      temperament,
    });

    await pet.save();

    // Agregar la mascota al array de pets del usuario
    await User.findByIdAndUpdate(
      ownerId,
      { $push: { pets: pet._id } },
      { new: true }
    );

    res.status(201).json(pet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create pet" });
  }
};

const getAllPets = async (req: Request, res: Response) => {
  try {
    // get ownerId from query string if exists
    const { ownerId } = req.query;

    // build the base filter
    const filter: any = { isActive: true };

    // if ownerId is provided, add it to the filter
    if (ownerId) {
      filter.owner = ownerId;
    }

    const pets = await Pet.find(filter).populate(
      "owner",
      "name lastname email"
    );
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: "Failed to get all pets" });
  }
};

const getPetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id).populate(
      "owner",
      "name lastname email phone"
    );

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve pet" });
  }
};

const getPetsByOwner = async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.params;
    const pets = await Pet.find({ owner: ownerId, isActive: true }).populate(
      "owner",
      "name lastname email"
    );

    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve pets by owner" });
  }
};

const updatePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Si se intenta cambiar el owner, validar que existe
    if (updateData.ownerId) {
      const userExists = await User.findById(updateData.ownerId);
      if (!userExists) {
        return res.status(404).json({
          error: "Owner not found",
          message: "The specified user ID does not exist",
        });
      }
      // Mapear ownerId a owner para el modelo
      updateData.owner = updateData.ownerId;
      delete updateData.ownerId;
    }

    const pet = await Pet.findByIdAndUpdate(id, updateData, { new: true });

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: "Failed to update pet" });
  }
};

const softDeletePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: "Failed to soft delete pet" });
  }
};

export default {
  createPet,
  getAllPets,
  getPetById,
  getPetsByOwner,
  updatePet,
  softDeletePet,
};
