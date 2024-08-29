// api/index.js

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./connectMongo');
const Player = require('./models/player');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Verbinde mit der Datenbank
connectDB();

// Statische Dateien aus dem public Ordner ausliefern
app.use(express.static(path.resolve(__dirname, '../public')));

// Root Route - Liefert die index.html Datei aus
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// API Endpunkte

app.post('/playerUpdate/:username/:newScore/:token', async (req, res) => {
  const { username, newScore, token } = req.params;
  const parsedScore = parseInt(newScore);

  if (!username || isNaN(parsedScore) || !token) {
    return res.status(400).json({ message: 'Bad Request: Missing or invalid parameters.' });
  }

  try {
 
    const splitToken = token.split('_');

    // Dekodieren des Scores
    const encodedScore = parseFloat(splitToken[1]); // Der kodierte Score
    const randomFactor = parseInt(splitToken[2], 10); // Der Zufallsfaktor
    
    // Den tatsächlichen Score berechnen
    const firstCheck = (encodedScore - randomFactor) / 44.5 - 25;
    const checkToken = Math.round(firstCheck); // Score als Integer runden
    
    // Dekodieren des Benutzernamens in Base64
    const decodedUsername = atob(splitToken[3]); // atob() dekodiert Base64 in den ursprünglichen String
    
    // Beispiel erwarteter Score und Benutzername
    
    // Validierung der dekodierten Werte
  

    if (checkToken !== parsedScore || decodedUsername !== username) {
      return res.status(200).json({ message: 'Score wurde erfolgreich aktualisiert!' });
    }

    let player = await Player.findOne({ username });

    if (!player) {
      // Neuer Spieler erstellen
      player = await Player.create({ username, score: parsedScore, token });
    } else if (parsedScore > player.score) {
      // Score aktualisieren, wenn neuer Score höher ist
      player.score = parsedScore;
      player.token = token;
      await player.save();
    }

    return res.status(200).json({
      message: 'Score wurde erfolgreich aktualisiert!',
      username: player.username,
      score: player.score,
    });
  } catch (error) {
    console.error('Error during player update:', error);
    return res.status(500).json({
      error: 'Internal Server Error during player update. Bitte melde dich bei @kenodev_ auf Instagram.',
    });
  }
});

app.get('/leaderboard/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const leaderboard = await Player.find()
      .sort({ score: -1 })
      .select('username score -_id');

    const player = await Player.findOne({ username: new RegExp(`^${username}$`, 'i') }).select('username score -_id');

    if (!player) {
      return res.status(404).json({ message: 'Spieler nicht gefunden' });
    }

    const position = leaderboard.findIndex(entry => entry.username.toLowerCase() === player.username.toLowerCase()) + 1;

    res.status(200).json({ leaderboard, player, position });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({
      error: 'Internal Server Error during fetching leaderboard. Bitte melde dich bei @kenodev_ auf Instagram.',
    });
  }
});

app.get('/playerStats/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const player = await Player.findOne({ username: new RegExp(`^${username}$`, 'i') }).select('username score -_id');

    if (!player) {
      return res.status(404).json({ message: 'Spieler nicht gefunden' });
    }

    const position = await Player.countDocuments({ score: { $gt: player.score } }) + 1;

    res.status(200).json({ player, position });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return res.status(500).json({
      error: 'Internal Server Error during fetching player stats. Bitte melde dich bei @kenodev_ auf Instagram.',
    });
  }
});

app.delete('/deleteSTATS/:secretKey', async (req, res) => {
  const { secretKey } = req.params;
  const VALID_SECRET_KEY = '661e7b3a3c5537d37b910089k3n023v661e8b8744084171b2bd3335';

  if (secretKey !== VALID_SECRET_KEY) {
    return res.status(401).json({ message: 'Unauthorized: Invalid secret key.' });
  }

  try {
    const result = await Player.deleteMany({});
    console.log('Deleted all data!');
    res.status(200).json({ message: 'Alle Spielerstatistiken wurden erfolgreich gelöscht.', result });
  } catch (error) {
    console.error('Error deleting stats:', error);
    return res.status(500).json({
      error: 'Internal Server Error during deleting stats. Bitte melde dich bei @kenodev_ auf Instagram.',
    });
  }
});

app.get('/testing', (req, res) => {
  res.status(200).json({ message: 'Welcome to my API' });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
