const express = require("express");
const cors = require("cors"); // to connect client and server
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const Message = require("./models/Message.js");
const ws = require("ws");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs"); // to rename files on the server
require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads")); // everything in uploads is displayed in the browser
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET,
      {},
      async (error, userData) => {
        if (error) throw error;
        resolve(userData);
      }
    );
  });
}

app.get("/test", (req, res) => {
  res.json("test ok");
});

// fetch all messages
app.get("/messages/:id", async (req, res) => {
  // res.json(req.params);
  const { id } = req.params;
  const userData = await getUserDataFromReq(req);
  const ourId = userData.id;
  // console.log({ id, ourId });
  const messages = await Message.find({
    sender: { $in: [id, ourId] }, // sender is either is or the other user
    recipient: { $in: [id, ourId] },
  }).sort({ createdAt: 1 }); // sort in descending order
  res.json(messages);
  // console.log(messages);
});

app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: true, name: true });
  res.json(users);
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(422).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password); // check if (encrypted) password is same as password that user entered
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
      if (error) throw error;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

// console.log({ __dirname });
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName, // safer to use full path (i.e. concat with __dirname)
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    // get extension in order to view file without downloading it
    const parts = originalname.split("."); // array of every part of originalname split by periods
    const extension = parts[parts.length - 1]; // get file extension (e.g. webp, png, etc.), which is the last element of the array parts
    const newPath = path + "." + extension;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", "")); // .replace so url to photo is just path/filename
  }
  // console.log(req.files);
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
    if (error) throw error;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

// get all current user's places
app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
    // userData is the decrypted token
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

// get place information
app.get("/places/:id", async (req, res) => {
  // res.json(req.params);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// edit/update places
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
    if (error) throw error;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      // userData.id is a string, so need to convert placeDoc.owner to string to compare them
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

// get all places
app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

// book a place
app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((error) => {
      throw error;
    });
});

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

const server = app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const wss = new ws.WebSocketServer({ server }); // create a WebSocket server
wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
    // [...wss.clients].length // gives number of connections
    // console.log([...wss.clients].map(c => c.username));

    // notify everyone about online people (when someone connects)
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            id: c.id,
            email: c.email,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      // if u don't get pong back in 1 sec, set isAlive to false
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log("dead");
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  // connection is connection b/t our server and one specific connection client
  // if u open the page, then u get connection to the server and this is the ws' connection to the client
  console.log("wss connected");
  // connection.send("hello"); // test receiving messages
  // console.log(req.headers)
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";") // may have > 1 cookie, so split them by semicolons
      .find((str) => str.startsWith("token=")); // only want the one starting with token=
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1]; // only want the actual token, which is after the "="
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (error, userData) => {
          if (error) throw error;
          const { id, email } = userData;
          // console.log(id);
          // console.log(email);
          connection.id = id;
          connection.email = email;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    // console.log(messageData);
    const { recipient, text, file } = messageData;
    let filename = null;
    if (file) {
      // console.log({ file });
      console.log("size", file.data.length);
      const parts = file.name.split(".");
      const extension = parts[parts.length - 1]; // get last part, which contains the file extension
      filename = Date.now() + "." + extension;
      const path = __dirname + "/uploads/" + filename;
      const bufferData = new Buffer(file.data.split(",")[1], "base64"); // read content from file.data, which is base64 encoded, so we need to decode it
      fs.writeFile(path, bufferData, () => {
        console.log("file saved: " + path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        // create new message in database
        sender: connection.id,
        recipient,
        text,
        file: file ? filename : null,
      });
      [...wss.clients]
        .filter((c) => c.id === recipient) // don't use find b/c it only finds one client. a user may be connected on multiple devices, so we want to find all of those connections
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.id,
              recipient,
              file: file ? filename : null, // need this to work on firefox
              _id: messageDoc._id,
            })
          )
        );
    }
  });

  notifyAboutOnlinePeople();
});
