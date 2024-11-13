const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
const Driver = require("./models/driver");
const Package = require("./models/package");
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const util = require('util');

const { Server } = require('socket.io');
const { Translate } = require('@google-cloud/translate').v2;
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const gemini_api_key = 'AIzaSyCtyDu1--hTYJoYg_ZMKbAsKBAg4AsEv7Y';


// Check if we're running in development (local) or production (VM)
const isLocal = (process.env.NODE_ENV === 'development' || process.env.HOSTNAME === 'localhost');

if (isLocal) {
  // Local path
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../service-account-file.json');
} else {
  // VM path
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'service-account-file-be.json');
}

console.log('Environment:', isLocal ? 'Local' : 'VM');
console.log('Using Google Credentials:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

console.log(isLocal);


const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});

// Initialize Google Cloud services
const translate = new Translate();
const ttsClient = new TextToSpeechClient(); // Initialize Text-to-Speech client

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use('/audio', express.static(path.join(__dirname, 'audio')));

// Load Firebase Admin SDK credentials
const serviceAccount = require("../fit2095-101ff-firebase-adminsdk-3fy0o-a944fd3891.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();  // Initialize Firestore

// Import routes
const driverRoutes = require('./routes/driver-route');
const packageRoutes = require('./routes/package-route');

// Connect to the db
mongoose.connect('mongodb://localhost:27017/FIT2095A3')
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });


// Use the routes
app.use('/api', driverRoutes);  // Mount the driver routes
app.use('/api', packageRoutes);  // Mount the package routes

app.get('/api/stats', async (req, res) => {
    try {
        // Firestore document reference
        const statsDoc = firestore.collection('data').doc('stats');

        // Get driver count and package count from MongoDB
        const [driverCount, packageCount] = await Promise.all([
        Driver.countDocuments(),
        Package.countDocuments()
        ]);

        // Fetch the Firestore document
        const doc = await statsDoc.get();

        if (doc.exists) {
        const statsData = doc.data();
        // Return Firestore data along with driverCount and packageCount
        res.json({ ...statsData, driverCount, packageCount });
        } else {
        res.status(404).json({ error: "Document not found" });
        }

    } catch (err) {
        console.error("Error getting document or data:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// Allow CORS for development purposes
app.use(cors());

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, '../dist/assignment3/browser')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/assignment3/browser/page-not-found/index.html'));
});


// Create server and initialize Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

// Handle connection for Socket.io
io.on('connection', (socket) => {
    console.log('An io user connected');

    // Handle translation request
    socket.on('translate_description', async (data) => {
        console.log('Received translation request:', data);
        const { description, targetLang } = data;
        try {
            const [translation] = await translate.translate(description, targetLang);
            socket.emit('translation_result', translation);
        } catch (error) {
            console.error('Translation error:', error);
            socket.emit('translation_error', 'Failed to translate the description.');
        }
    });

    // Handle text-to-speech request
    socket.on('text_to_speech', async (data) => {
      console.log('Received TTS request:', data);
      const { text } = data;
      const request = {
        input: { text: text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' }
      };

      try {
        const [response] = await ttsClient.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        const fileName = `audio/output-${Date.now()}.mp3`;  // Save to the audio folder
        await writeFile(fileName, response.audioContent, 'binary');

        console.log('Audio written to file:', fileName);

        // Access the host from the socket's handshake headers
        const host = socket.handshake.headers.host;
        socket.emit('tts_result', `http://${host}/${fileName}`);
      } catch (error) {
        console.error('TTS error:', error);
        socket.emit('tts_error', 'Unable to convert text to speech.');
      }
    });
        // Distance calculation using Google Generative AI (Gemini)
        socket.on('calculate_distance', async (data) => {
            console.log('Received distance calculation request:', data);
            const { destination } = data;
            try {
                const prompt = `Calculate the driving distance between Melbourne and ${destination} in kilometers.`;
                const response = await geminiModel.generateContent(prompt);

                const distance = response.response.text() || "No response received";

                console.log('Distance calc:', distance);

                socket.emit('distance_result', { distance });
            } catch (error) {
                console.error('Distance calculation error:', error);
                socket.emit('distance_error', 'Unable to calculate the distance.');
            }
        });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Serve static files for the generated MP3 files
app.use('/output', express.static(path.join(__dirname, 'output')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
