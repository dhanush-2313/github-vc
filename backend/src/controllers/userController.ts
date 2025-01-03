import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();
let secret = process.env.JWT_SECRET;

const getAllUsers = async (req: Request, res: Response) => {
    res.send("All users fetched")
}

const signup = async (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (user) {
            res.status(400).json({ message: "User already exists" })
            return
        }

        const salt = await bcrypt.genSalt(17);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                followedUsers: {
                    create: []
                },
                ownedRepos: {
                    create: []
                },
                starRepos: {
                    create: []
                }
            }
        })

        const token = jwt.sign({ id: newUser.id }, secret!, { expiresIn: "1h" });
        res.status(201).json({ token })

    } catch (error: any) {
        console.error("Error while signing up user", error.message)
        res.status(500).json({ message: "Error while signing up user" })
    }
}

const login = async (req: Request, res: Response) => {
    res.send("User logged in")
}

const getUser = async (req: Request, res: Response) => {
    res.send("User profile fetched")
}

const updateUser = async (req: Request, res: Response) => {
    res.send("User profile updated")
}

const deleteUser = async (req: Request, res: Response) => {
    res.send("User deleted")
}

export const userController = {
    getAllUsers,
    signup,
    login,
    getUser,
    updateUser,
    deleteUser
}