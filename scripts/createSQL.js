// INSERT INTO "transcript"("fifteen_minutes_score","midterm_score","final_score","student_id","subject_id","semester") VALUES(10,9,9,1,1,'1');
let data = [];
for (let semester = 1; semester < 3; semester++)
  for (let student_id = 1; student_id < 6; student_id++) {
    for (let subject_id = 1; subject_id < 40; subject_id++) {
      data.push(
        `INSERT INTO "transcript"("fifteen_minutes_score","midterm_score","final_score","student_id","subject_id","semester") VALUES(${
          Math.floor(Math.random() * (10 - 5 + 1)) + 5
        },${Math.floor(Math.random() * (10 - 5 + 1)) + 5},${
          Math.floor(Math.random() * (10 - 6 + 1)) + 6
        },${student_id},${subject_id},${semester.toString()});`
      );
    }
  }

const fs = require('fs');

const filePath = 'sql.sql';

const sqlString = data.join('\n');

fs.writeFile(filePath, sqlString, (err) => {
  if (err) {
    console.error('Error writing to file:', err);
    return;
  }
  console.log('Data has been written to file successfully.');
});
