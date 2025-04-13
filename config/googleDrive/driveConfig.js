import { google } from 'googleapis';
const drive = google.drive({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    keyFile: './config/googleDrive/cvwebsite-456504-79f7a2cc2c82.json',
    scopes: ['https://www.googleapis.com/auth/drive'],
  }),
});

export default drive;