import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Tag, { TagType } from "../../models/Tag";

export const generateTagBatch = async (req: Request, res: Response) => {
  try {
    const { quantity, batchNumber } = req.body;
    const baseUrl = "http://192.168.100.2:5173";

    const tags = [];

    for (let i = 0; i < quantity; i++) {
      const tagId = nanoid(10);
      const qrUrl = `${baseUrl}/pet/${tagId}`;

      tags.push({
        tagId,
        qrUrl,
        batchNumber,
        isActive: false,
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
      isActive: tag.isActive,
      qrUrl: tag.qrUrl,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  generateTagBatch,
  verifyTag,
};
