import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiTutorRouter from "./ai-tutor";
import learningRouter from "./learning";

const router: IRouter = Router();

router.use(healthRouter);
router.use('/ai', aiTutorRouter);
router.use('/learning', learningRouter);

export default router;
