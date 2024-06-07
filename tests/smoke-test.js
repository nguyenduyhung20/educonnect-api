import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: '30s',

  // The following section contains configuration options for execution of this
  // test script in Grafana Cloud.
  //
  // See https://grafana.com/docs/grafana-cloud/k6/get-started/run-cloud-tests-from-the-cli/
  // to learn about authoring and running k6 test scripts in Grafana k6 Cloud.
  //
  cloud: {
    // The ID of the project to which the test is assigned in the k6 Cloud UI.
    // By default tests are executed in default project.
    projectID: 3699134,
    // The name of the test in the k6 Cloud UI.
    // Test runs with the same name will be grouped.
    name: 'smoke-test.js'
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

  const response = http.get('https://educonnect.life/api/v1/post/1004', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  check(response, {
    'API request success': (res) => res.status === 200
  });

  sleep(1);
}
