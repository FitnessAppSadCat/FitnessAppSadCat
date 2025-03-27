import mongoose from 'mongoose';
import Exercise from '../models/Exercise.js'; // Импорт модели
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';


// Загружаем переменные окружения
dotenv.config();



const exercisesPath = path.join(process.cwd(), 'data', 'all_exs.json');

const loadExercises = async () => {
    try {
        // 1. Подключение к MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Подключение к MongoDB успешно установлено.');

        

        // 2. Чтение данных из файла
        const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'));
        console.log('Данные из файла успешно прочитаны.');

        // 3. Загрузка данных в MongoDB
        await Exercise.insertMany(exercisesData);
        console.log('Данные успешно загружены в MongoDB.');
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    } finally {
        // 4. Закрытие соединения
        mongoose.connection.close();
        console.log('Соединение с MongoDB закрыто.');
    }
};

// Запуск функции загрузки
loadExercises();



const fetchExercises = async () => {
  try {
    const response = await axios.get('https://wger.de/api/v2/exercise/');
    console.log(response.data.results); // Список упражнений
  } catch (error) {
    console.error('Ошибка при получении упражнений:', error);
  }
};

fetchExercises();