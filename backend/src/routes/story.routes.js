// story.routes.js
import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import {
  createStory,
  deleteStory,
  autoDeleteStories,
  getAllStories,
} from '../controllers/story.controllers.js';
import { multerUpload } from '../config/multer.config.js';
import { parseBody } from '../middleware/bodyParser.js';

const router = express.Router();

// Route to create a story
router.post('/create',multerUpload.fields([
  { name: 'image', maxCount: 1 },
]),parseBody,  fetchUser, createStory);

// Route to delete a story
router.delete('/:storyId', fetchUser, deleteStory);

// Route to automatically delete stories older than 24 hours (should be run via a cron job)
router.delete('/auto-delete', autoDeleteStories);

// Route to get all stories of all users
router.get('/', getAllStories);

export default router;
