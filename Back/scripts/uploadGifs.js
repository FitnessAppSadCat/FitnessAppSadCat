import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pLimit from 'p-limit';
import { stringify } from 'csv-stringify'; // Для создания CSV-файла

// Загружаем переменные окружения
dotenv.config();

// Настройка Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функция для загрузки одного файла
const uploadFile = async (filePath, fileName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'Gifs', // Укажите папку в Cloudinary
    });
    return { fileName, url: result.secure_url }; // Возвращаем имя файла и URL
  } catch (error) {
    console.error(`Error uploading file ${fileName}:`, error.message);
    return { fileName, url: null }; // Возвращаем null, если загрузка не удалась
  }
};

// Функция для загрузки всех файлов из папки
const uploadFolder = async (folderPath) => {
  try {
    // Получаем список файлов в папке
    const files = fs.readdirSync(folderPath).filter((file) => {
      return fs.statSync(path.join(folderPath, file)).isFile();
    });

    console.log(`Found ${files.length} files to upload.`);

    // Ограничиваем количество одновременных загрузок
    const limit = pLimit(10); // Максимум 10 одновременных загрузок

    // Загружаем файлы с ограничением параллелизма
    const uploadPromises = files.map((file) => {
      const filePath = path.join(folderPath, file);
      return limit(() => uploadFile(filePath, file)); // Передаем имя файла
    });

    // Ожидаем завершения всех загрузок
    const results = await Promise.all(uploadPromises);

    // Фильтруем успешные загрузки
    const successfulUploads = results.filter((result) => result.url !== null);
    console.log(`Successfully uploaded ${successfulUploads.length} files.`);

    // Создаем CSV-файл с результатами
    const outputFilePath = path.join(process.cwd(), 'upload_results.csv');
    const writableStream = fs.createWriteStream(outputFilePath);

    // Создаем CSV-заголовок
    const columns = ['File Name', 'URL'];
    const stringifier = stringify({ header: true, columns });

    // Записываем данные в CSV
    successfulUploads.forEach((result) => {
      stringifier.write([result.fileName, result.url]);
    });

    stringifier.pipe(writableStream);
    console.log(`Results saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error uploading folder:', error.message);
  }
};

// Укажите путь к папке с файлами
const folderPath = path.join(process.cwd(), 'gifki'); // Замените на ваш путь

// Загружаем все файлы из папки
uploadFolder(folderPath);