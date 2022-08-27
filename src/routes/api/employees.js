import { Router } from "express";
import ROLES_LIST from "../../config/rolesList.js";
import {
  createNewEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
} from "../../controllers/employeesController.js";
import verifyRoles from "../../middleware/verifyRoles.js";

const router = Router();

router
  .route("/")
  .get(getAllEmployees)
  .post(verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), createNewEmployee)
  .put(verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), updateEmployee)
  .delete(verifyRoles(ROLES_LIST.ADMIN), deleteEmployee);

router.route("/:id").get(getEmployee);

export default router;
