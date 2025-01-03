import { Request, Response } from "express"


const createRepo = async (req: Request, res: Response) => {
    res.send("Repo created")
}

const getAllRepo = async (req: Request, res: Response) => {
    res.send("All repos fetched")
}

const fetchRepoById = async (req: Request, res: Response) => {
    res.send("Repo fetched")
}

const fetchRepoByName = async (req: Request, res: Response) => {
    res.send("Repo fetched")
}

const fetchRepoForCurrentUser = async (req: Request, res: Response) => {
    res.send("Repo fetched for logged in user")
}

const updateRepoById = async (req: Request, res: Response) => {
    res.send("Repo updated")
}

const toggleRepoVisibility = async (req: Request, res: Response) => {
    res.send("Repo visibility toggled")
}

const deleteRepoById = async (req: Request, res: Response) => {
    res.send("Repo deleted")
}

export const repoController = {
    createRepo,
    getAllRepo,
    fetchRepoById,
    fetchRepoByName,
    fetchRepoForCurrentUser,
    updateRepoById,
    toggleRepoVisibility,
    deleteRepoById
}