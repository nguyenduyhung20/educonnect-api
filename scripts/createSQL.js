let data = [];
for (let class_id = 1; class_id < 4; class_id++) {
  for (let subject_id = 1; subject_id < 14; subject_id++) {
    data.push(`INSERT INTO "learn"("class_id","subject_id") VALUES(${class_id},${subject_id + 13 * (class_id - 1)});`);
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
