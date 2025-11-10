import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Tag, { TagType } from "../../models/Tag";
import Pet from "../../models/Pet";

export const generateTagBatch = async (req: Request, res: Response) => {
  try {
    const { quantity, batchNumber } = req.body;
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const tags = [];

    for (let i = 0; i < quantity; i++) {
      const tagId = nanoid(10);
      const qrUrl = `${baseUrl}/pet/${tagId}`;

      tags.push({
        tagId,
        qrUrl,
        batchNumber,
        isActivated: false,
      });
    }

    const createdTags = await Tag.insertMany(tags);
    res.status(201).json({
      message: `${quantity} chapitas generadas exitosamente`,
      tags: createdTags,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyTag = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.params;

    const tag = await Tag.findOne({ tagId });
    if (!tag) {
      return res.status(404).json({
        valid: false,
        error: "Código de chapita no válido",
      });
    }

    res.json({
      valid: true,
      isActivated: tag.isActivated,
      qrUrl: tag.qrUrl,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// get tag information (activated or not) - with optional authentication
export const getTagInfo = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.params;
    const userId = (req as any).user?.uid; // can be undefined if not authenticated

    const tag = await Tag.findOne({ tagId });

    if (!tag) {
      return res.status(404).json({
        error: "Chapita no encontrada",
        message: "El código de esta chapita no es válido.",
      });
    }

    if (!tag.isActivated) {
      return res.json({
        isActivated: false,
        tagId: tag.tagId,
        canActivate: !!userId, // true if authenticated
        needsLogin: !userId,
        message: userId
          ? "Esta chapita está disponible para ser activada"
          : "Inicia sesión para activar esta chapita",
      });
    }

    // if is activated, get public profile
    const pet = await Pet.findById(tag.petId)
      .populate("owner", "name lastname email phone")
      .lean();

    if (!pet || !pet.isPublicProfile) {
      return res.status(404).json({
        error: "Perfil no disponible",
        message: "El perfil de esta mascota no está disponible públicamente.",
      });
    }

    // type assertion for the populated owner
    const owner = pet.owner as any;

    const publicProfile = {
      isActivated: true,
      pet: {
        name: pet.name,
        description: pet.description,
        breed: pet.breed,
        gender: pet.gender,
        photos: pet.photos,
        temperament: pet.temperament,
        medicalInformation: pet.medicalInformation,
      },
      owner: {
        name: owner.name
          ? `${owner.name} ${owner.lastname || ""}`.trim()
          : owner.email,
        phone: owner.phone,
        email: owner.email,
      },
    };

    res.json(publicProfile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// activate a tag (link to pet) - requires authentication
export const activateTag = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.params;
    const { petId } = req.body;
    const userId = (req as any).user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const tag = await Tag.findOne({ tagId });
    if (!tag) {
      return res.status(404).json({ error: "Chapita no encontrada" });
    }

    if (tag.isActivated) {
      return res.status(400).json({ error: "Esta chapita ya está activada" });
    }

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    if (pet.owner !== userId) {
      return res
        .status(403)
        .json({ error: "No tienes permisos sobre esta mascota" });
    }

    if (pet.tagId) {
      return res.status(400).json({
        error: "Esta mascota ya tiene una chapita asociada",
      });
    }

    // activate the tag
    tag.isActivated = true;
    tag.petId = pet._id;
    tag.activatedBy = userId;
    tag.activatedAt = new Date();
    await tag.save();

    // update the pet
    (pet as any).tagId = tagId;
    (pet as any).tagActivatedAt = new Date();
    (pet as any).isPublicProfile = true; // activate public profile by default
    await pet.save();

    res.json({
      message: "Chapita activada exitosamente",
      tag,
      pet,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los tags (para admin/testing)
export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 }); // Más recientes primero
    res.json(tags);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  generateTagBatch,
  verifyTag,
  getTagInfo,
  activateTag,
  getAllTags,
};
