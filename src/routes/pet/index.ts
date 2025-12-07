import { Router } from "express";
import controllers from "./controllers";
import validationMiddleware from "../../middleware/validator";
import {
  createPetValidationSchema,
  updatePetValidationSchema,
} from "./validations";

const router: Router = Router();

router.post(
  "/",
  validationMiddleware(createPetValidationSchema),
  controllers.createPet
);
router.get("/", controllers.getAllPets);
router.get("/lost", controllers.getLostPets);
router.get("/owner/:ownerId", controllers.getPetsByOwner);
router.get("/:id", controllers.getPetById);
router.patch(
  "/:id",
  validationMiddleware(updatePetValidationSchema),
  controllers.updatePet
);
router.patch("/:id/lost", controllers.toggleLostStatus);
router.delete("/:id", controllers.softDeletePet);

export default router;
