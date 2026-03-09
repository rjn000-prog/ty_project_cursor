import { loginUser } from "./auth.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message || "Login failed",
    });
  }
};
