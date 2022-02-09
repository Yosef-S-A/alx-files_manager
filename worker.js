import Queue from 'bull';
import fs from 'fs';
import imageThumbnail from 'image-thumbnail';
import { ObjectId } from 'mongodb';
import dbClient from './utils/db';

const fileQueue = Queue('fileQueue');

fileQueue.process(async (job, done) => {
  const { fileId, userId } = job.data;
  if (!fileId) done(new Error('Missing fileId'));
  if (!userId) done(new Error('Missing userId'));

  const requestedFile = await dbClient.files.findOne({
    _id: ObjectId(fileId),
    userId: ObjectId(userId),
  });

  if (!requestedFile) done(new Error('File not found'));
