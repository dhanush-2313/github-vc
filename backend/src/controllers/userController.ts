import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import prisma from "../config/prismaClient";

let secret = process.env.JWT_SECRET;

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                followedUsers: true,
                ownedRepos: true,
                starRepos: true,
            },
        });
        res.status(200).json(users)
    } catch (error: any) {
        console.error("Error while fetching all users", error.message)
        res.status(500).json({ message: "Error while fetching all users" })
    }
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
        res.status(201).json({ token, userId: newUser.id })

    } catch (error: any) {
        console.error("Error while signing up user", error.message)
        res.status(500).json({ message: "Error while signing up user" })
    }
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            res.status(400).json({ message: "User does not exist" })
            return
        }

        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" })
            return
        }

        const token = jwt.sign({ id: user.id }, secret!, { expiresIn: "1h" });
        res.status(200).json({ token, userId: user.id })
    } catch (error: any) {
        console.error("Error while logging in user", error.message)
        res.status(500).json({ message: "Error while logging in user" })
    }
}

const getUser = async (req: Request, res: Response) => {
    const currentUserID = req.params.userId;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(currentUserID)
            },
            include: {
                followedUsers: true,
                ownedRepos: true,
                starRepos: true,
            }
        })
        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }
        res.status(200).json(user)
    } catch (error: any) {
        console.error("Error while fetching user", error.message)
        res.status(500).json({ message: "Error while fetching user" })
    }

}

const updateUser = async (req: Request, res: Response) => {
    const currentUserID = req.params.userId;
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(currentUserID)
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        let updateFields: any = {};
        if (email) {
            updateFields.email = email;
        }
        if (password) {
            const salt = await bcrypt.genSalt(17);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const result = await prisma.user.update({
            where: {
                id: parseInt(currentUserID)
            },
            data: updateFields
        });

        res.status(200).json({ message: "User updated successfully" });
    } catch (error: any) {
        console.error("Error while updating user", error.message);
        res.status(500).json({ message: "Error while updating user" });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const currentUserID = req.params.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(currentUserID)
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const result = await prisma.user.delete({
            where: {
                id: parseInt(currentUserID)
            }
        });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Error while deleting user", error.message);
        res.status(500).json({ message: "Error while deleting user" });
    }
}

export const userController = {
    getAllUsers,
    signup,
    login,
    getUser,
    updateUser,
    deleteUser
}