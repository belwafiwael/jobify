import {body, validationResult,param} from 'express-validator'
import { BadRequestError,NotFoundError, UnauthorizedError } from '../errors/customErrors.js'
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js'
import Job from '../models/JobModel.js';
import mongoose from 'mongoose'
import User from '../models/UserModel.js';

const widthValidationErrors = (validateValues) =>{
    return [validateValues,
        (req, res, next) =>{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                const errorMessages = errors.array().map((error) => error.msg)
                if (errorMessages[0].startsWith('no job')) {
                    throw new NotFoundError(errorMessages);
                }
                if (errorMessages[0].startsWith('not authorized')) {
                    throw new UnauthorizedError('not authorized to access this route');
                }
               throw new BadRequestError(errorMessages)
            }
            next()
        }
    ]
}
export const validateJobInput = widthValidationErrors([
    body('company').notEmpty().withMessage('company is required'),
    body('position').notEmpty().withMessage('position is required'),
    body('jobLocation').notEmpty().withMessage('job location is required'),
    body('jobStatus').isIn(Object.values(JOB_STATUS)).withMessage('invalid status value'),
    body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('invalid type value'),
    
])

export const validateIdParam = widthValidationErrors([
    param('id').custom(async (value,{req}) => {
        const isValidId = mongoose.Types.ObjectId.isValid(value);
        if (!isValidId) throw new BadRequestError('invalid MongoDB id');
        const job = await Job.findById(value);
        if (!job) throw new NotFoundError(`no job with id : ${value}`);
        const isAdmin = req.user.role === 'admin';
        const isOwner = req.user.userId === job.createdBy.toString();
        if (!isAdmin && !isOwner)
            throw UnauthorizedError('not authorized to access this route');
    }),
])

export const validateRegisterInput = widthValidationErrors([
    body('name').notEmpty().withMessage('name is required'),
    body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email format')
    .custom(async (email) => {
        const user = await User.findOne({ email });
        if (user) {
          throw new BadRequestError('email already exists');
        }
      }),
    body('password')
    .notEmpty().withMessage('password is required')
    .isLength({ min: 7 }).withMessage('password must be at least 7 characters long'),
    body('lastName').notEmpty().withMessage('last name is required'),
    body('location').notEmpty().withMessage('location is required'),

])
export const validateLoginInput = widthValidationErrors([
    body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email format'),
    body('password')
      .notEmpty().withMessage('password is required')
      .isLength({ min: 7 }).withMessage('password must be at least 7 characters long'),
])


export const validateUpdateUserInput = widthValidationErrors([
    body('name').notEmpty().withMessage('name is required'),
    body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email format')
    .custom(async (email, {req}) => {
        const user = await User.findOne({ email });
        if (user && user._id.toString() !== req.user.userId) {
          throw new BadRequestError('email already exists');
        }
      }),
    body('lastName').notEmpty().withMessage('last name is required'),
    body('location').notEmpty().withMessage('location is required'),

])