import jwt from "jsonwebtoken";


export const generateToken = (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
  } catch (error) {
    console.error("Token generation failed:", error.message);
    return null;
  }
};
