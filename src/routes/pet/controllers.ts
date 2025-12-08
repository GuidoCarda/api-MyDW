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
    const { ownerId } = req.query;

    const filter: any = { isActive: true };

    if (ownerId) {
      filter.owner = ownerId;
    }

    const pets = await Pet.find(filter).populate(
      "owner",
      "name lastname email phone address"
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
      "name lastname email phone address"
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
      "name lastname email phone address"
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

    if (updateData.ownerId) {
      const userExists = await User.findById(updateData.ownerId);
      if (!userExists) {
        return res.status(404).json({
          error: "Owner not found",
          message: "The specified user ID does not exist",
        });
      }
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

type PetLostStatus = {
  isLost: boolean;
  lostAt?: Date | null;
};

const toggleLostStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isLost } = req.body;

    if (typeof isLost !== "boolean") {
      return res.status(400).json({
        error: "Invalid request",
        message: "isLost must be a boolean value",
      });
    }

    const updateData: PetLostStatus = { isLost };

    if (isLost) {
      updateData.lostAt = new Date();
    } else {
      updateData.lostAt = null;
    }

    const pet = await Pet.findByIdAndUpdate(id, updateData, { new: true });

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update pet lost status" });
  }
};

const getLostPets = async (req: Request, res: Response) => {
  try {
    const lostPets = await Pet.find({ isLost: true, isActive: true }).populate(
      "owner",
      "name lastname email phone address"
    );
    res.status(200).json(lostPets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get lost pets" });
  }
};

export default {
  createPet,
  getAllPets,
  getPetById,
  getPetsByOwner,
  updatePet,
  softDeletePet,
  toggleLostStatus,
  getLostPets,
};
