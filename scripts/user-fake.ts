import fs from 'fs';
import { faker } from '@faker-js/faker';

function generateUserSql(numRecords: number) {
  let userSexes = ['male', 'female', 'other'];
  let userRoles = ['admin', 'teacher', 'student', 'parent', 'user'];

  let sqlFileContent = '';

  for (let i = 0; i < numRecords; i++) {
    let randomSex = faker.helpers.arrayElement(userSexes);
    let randomRole = faker.helpers.arrayElement(userRoles);

    // Generate user query
    const userQuery = `
WITH new_user AS (
  INSERT INTO "user" (address, name, phone, birthday, email, ssn, sex, role)
  VALUES ('${faker.location.streetAddress()}', '${faker.person.fullName()}', '${faker.phone.number()}', '${faker.date
    .past()
    .toISOString()}', '${faker.internet.email()}', '${faker.string.alphanumeric(10)}', '${randomSex}', '${randomRole}')
  RETURNING id
),
`;

    // Generate account query
    const accountQuery = `
new_account AS (
  INSERT INTO "account" (id, username, password, avatar)
  SELECT id, '${faker.internet.userName()}', '${faker.internet.password()}', '${faker.internet.avatar()}'
  FROM new_user
  RETURNING id
)
`;

    sqlFileContent += `${userQuery}${accountQuery}`;

    // Generate 2 - 6 posts for each user
    const numPosts = faker.number.int({ min: 2, max: 6 });
    let postQueries = '';
    for (let j = 0; j < numPosts; j++) {
      postQueries += `
  SELECT '${faker.lorem.sentences()}' AS content, id
  FROM new_account
  ${j < numPosts - 1 ? 'UNION ALL' : ''}
`;
    }

    // Add the final post insert query
    const finalQuery = `
INSERT INTO "post" (content, user_id)
${postQueries};
`;

    sqlFileContent += finalQuery;
  }

  fs.writeFileSync('./scripts/init.sql', sqlFileContent);
}

generateUserSql(20); // Replace 100 with the number of records you want to generate
