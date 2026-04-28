import { Router } from 'express';
import { generateImageUploadSignedUrl } from '../controllers/aws.controller';
import { protect } from '../middlewares/auth.middleware';

const awsRouter = Router();

awsRouter.use(protect);
awsRouter.post('/signed-url/image', generateImageUploadSignedUrl);

export default awsRouter;
