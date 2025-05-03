import { readFile, writeFile } from 'fs/promises';
import { createReadStream } from 'fs';
import { join } from 'path';
import csv from 'csv-parser';

const updateExerciseGifs = async () => {
    try{
        const exercises = JSON.parse(await readFile('../db/all_exrc.json', 'utf-8'));

        const urlMap = new Map();
        await new Promise((resolve, reject) => { 
          createReadStream('../db/upload_result.csv')
          .pipe(csv( { separator: '\t', headers: ['filename', 'url'] }))
          .on('data', (row) => {
            const id = row.filename.replace('.gif', '');
            urlMap.set(id, row.url);
          })
          .on('end', resolve)
          .on('error', reject);
        });
        let updateCount = 0;
        const updatedExercises = exercises.map(exc => {
          const newUrl = urlMap.get(exc.id);
          if (newUrl) {
            updateCount++;
            return { ...exc, gifUrl: newUrl };
          }
          return exc;
        });

        await writeFile(
            join(process.cwd(), 'exercises_updated.json'),
            JSON.stringify(updatedExercises, null, 2)
          );

          console.log(`Processed ${exercises.length} exercises`);
          console.log(` Updated ${updateCount} GIF URLs`);
          console.log(` Skipped ${exercises.length - updateCount} exercises (no mapping)`);
          console.log(' Saved to exercises_updated.json');
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
          }
    };

    updateExerciseGifs();


