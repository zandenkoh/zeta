export default async function handler(req, res) {
  res.status(200).json({
    firebaseConfig: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
    apiKeyPool: [
      { key: process.env.API_KEY_1, usage: 0, limit: 1000, active: true },
      { key: process.env.API_KEY_2, usage: 0, limit: 1000, active: true },
      // Add other keys as needed
    ],
    serpApiKey: process.env.SERP_API_KEY,
  });
}
