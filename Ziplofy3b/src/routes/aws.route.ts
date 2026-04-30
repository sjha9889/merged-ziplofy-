import { Router } from 'express';
import { deleteImagesFromS3, generateImageUploadSignedUrl } from '../controllers/aws.controller';
import { protect } from '../middlewares/auth.middleware';

const awsRouter = Router();

awsRouter.use(protect);
awsRouter.post('/signed-url/image', generateImageUploadSignedUrl);
awsRouter.post('/delete-images', deleteImagesFromS3);

export default awsRouter;
