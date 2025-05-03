import mongoose from 'mongoose';
import Exercise from '../src/models/ExerciseModel.js'; 
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';


dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

const exercisesPath = path.join(process.cwd(), 'db', 'exercises_updated.json');

const loadExercises = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('The connection to MongoDB has been successfully established.');


        await Exercise.deleteMany({});
        console.log('All exercises have been deleted.');


        const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'));
        console.log('Data from file read');

        await Exercise.insertMany(exercisesData);
        console.log('The data has been successfully uploaded to MongoDB.');
    } catch (error) {
        console.error('Error uploading data:', error);
    } finally {
        mongoose.connection.close();
        console.log('The connection to MongoDB is closed.');
    }
};

loadExercises();



