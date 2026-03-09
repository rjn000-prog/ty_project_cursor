import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

console.log("🔥 BACKEND RESTARTED WITH CORRECT CONFIG 🔥");

// --------------------
// MIDDLEWARES (ORDER MATTERS)
// --------------------

app.use(express.json());

// ✅ CORS (NO '*', REQUIRED FOR SESSIONS)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ SESSION (MUST BE BEFORE ROUTES)
app.use(session({
  secret: "super-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,     // true only on HTTPS
    sameSite: "lax"
  }
}));

// --------------------
// ADMIN GUARD
// --------------------
function requireAdmin(req, res, next) {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Admin login required" });
  }
  next();
}

// --------------------
// TEST ROUTE
// --------------------
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

// --------------------
// ADMIN AUTH ROUTES
// --------------------

app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
//DEBUGGING START
  console.log("PASSWORD TYPED mooom:", password);

  const admin = await prisma.admin.findUnique({
    where: { email }
  });

  if (!admin) {
    console.log("ADMIN NOT FOUND lll");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  console.log("HASH IN DB:", admin.password);

  const isMatch = await bcrypt.compare(password, admin.password);
  console.log("BCRYPT MATCH:", isMatch);
// DEBUGGING END
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.admin = {
    id: admin.id,
    name: admin.name,
    role: admin.role
  };

  res.json({ message: "Login successful" });
});


app.get("/admin/check", (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Not logged in" });
  }
  res.json({ admin: req.session.admin });
});

app.post("/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

// --------------------
// ADMIN DATA ROUTE (CLUB)
// --------------------
app.post("/admin/clubs", requireAdmin, async (req, res) => {
  try {
    await prisma.club.create({
      data: {
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        presidentName: req.body.presidentName,
        contactEmail: req.body.contactEmail,
        capacity: Number(req.body.capacity),
        location: req.body.location
      }
    });

    res.json({ message: "Club added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding club" });
  }
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});


// STUDENT LOGIN

// STUDENT LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ set session cookie (example)
    res.cookie("auth", student.id, {
      httpOnly: true,
      sameSite: "lax",
    });

    // ✅ ALWAYS respond
    return res.json({
      role: "student",
      id: student.id,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// ME 
app.get("/me", async (req, res) => {
  try {
    const studentId = req.cookies.auth;

    if (!studentId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!student) {
      return res.status(401).json({ message: "Invalid session" });
    }

    return res.json(student);
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


//  STUDENT CLUB FETCH
app.get("/student/dashboard", async (req, res) => {
  const studentId = req.session.studentId;

  if (!studentId) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      student_club: {
        include: {
          club: true
        }
      },
      student_event: {
        include: {
          event: {
            include: { club: true }
          }
        }
      }
    }
  });

  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });

  res.json({
    studentName: student.name,
    clubs: student.student_club.map(sc => sc.club),
    events: student.student_event.map(se => se.event),
    stats: {
      clubCount: student.student_club.length,
      eventCount: student.student_event.length
    },
    notices
  });
});
