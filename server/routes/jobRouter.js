import  { Router} from 'express'
import { validateJobInput,validateIdParam } from '../middleware/validationMiddleware.js';

const router = Router()

import {getAllJobs,getSingleJob, updateJob, createJob, deleteJob, showStats} from '../controllers/jobController.js'
import { checkForTestUser } from '../middleware/authMiddleware.js';

router.route('/').get(getAllJobs).post(checkForTestUser,validateJobInput,createJob)
router.route('/stats').get(showStats)
router
.route('/:id')
.get(validateIdParam,getSingleJob)
.patch(checkForTestUser,validateJobInput,validateIdParam,updateJob)
.delete(checkForTestUser,validateIdParam,deleteJob)

export default router
