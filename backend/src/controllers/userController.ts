import { Request, Response } from "express"

const getAllUsers = async (req: Request, res: Response) => {
    res.send("All users fetched")
}

const signup = async (req: Request, res: Response) => {
    res.send("User signed up")
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