import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    {
      duration: '10s',
      target: 1000
    },
    {
      duration: '30s',
      target: 1000
    },
    {
      duration: '10s',
      target: 0
    }
  ],

  cloud: {
    // The ID of the project to which the test is assigned in the k6 Cloud UI.
    // By default tests are executed in default project.
    projectID: 3699134,
    // The name of the test in the k6 Cloud UI.
    // Test runs with the same name will be grouped.
    name: 'load-test.js'
  }
};

const authUrl = 'https://educonnect.life/api/v1/auth/login';
const credentials = {
  username: 'duyhung',
  password: 'duyhung'
};

export default function () {
  // call auth api first to get token then attach to this request
  const authResponse = http.post(authUrl, JSON.stringify(credentials), {
    headers: { 'Content-Type': 'application/json' }
  });
  check(authResponse, {
    'Auth request success': (res) => res.status === 200
  });

  const token = authResponse.json('token');

  // const randomPostId = Math.floor(Math.random() * 22000 + 100)
  // const response = http.get(`https://educonnect.life/api/v1/post/${1000}`, {
  //   headers: {
  //     Authorization: `Bearer ${token} `
  //   }
  // });

  // check(response, {
  //   'API request success': (res) => res.status === 200
  // });

  // sleep(1);

  const newsfeedResponse = http.get('https://educonnect.life/api/v1/user/newsfeed', {
    headers: {
      Authorization: `Bearer ${token} `
    }
  });

  check(newsfeedResponse, {
    'Newsfeed request success': (res) => res.status === 200
  });

  sleep(1);
}
