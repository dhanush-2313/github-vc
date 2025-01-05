import { Request, Response } from "express"
import prisma from "../config/prismaClient";

interface CustomRequest extends Request {
    user?: any;
}

const createRepo = async (req: Request, res: Response) => {
    const { ownerId, name, issues, content, description, visibility } = req.body;
    try {
        if (!ownerId || !name) {
            res.status(400).json({ message: "Please provide all required fields" });
            return;
        }
        const repo = await prisma.repository.create({
            data: {
                owner: {
                    connect: { id: ownerId }
                },
                name,
                issues: {
                    create: issues || []
                },
                content: Array.isArray(content) ? content : [content],
                description,
                visibility
            }
        });
        res.status(201).json({ message: "Repo created successfully", repoId: repo.id });
    } catch (error: any) {
        console.error("Error while creating repo", error.message);
        res.status(500).json({ message: "Error while creating repo" });
    }
};

const getAllRepo = async (req: Request, res: Response) => {
    try {
        const repos = await prisma.repository.findMany({
            include: {
                owner: true,
                issues: true
            }
        });
        res.status(200).json(repos);
    } catch (error: any) {
        console.error("Error while fetching all repos", error.message);
        res.status(500).json({ message: "Error while fetching all repos" });

    }
}

const fetchRepoById = async (req: Request, res: Response) => {
    const repoId = req.params.id;
    try {
        const repo = await prisma.repository.findUnique({
            where: {
                id: parseInt(repoId)
            },
            include: {
                owner: true,
                issues: true
            }
        });
        if (!repo) {
            res.status(404).json({ message: "Repo not found" });
            return;
        }
        res.status(200).json(repo);

    } catch (error: any) {
        console.error("Error while fetching repo by id", error.message);
        res.status(500).json({ message: "Error while fetching repo by id" });

    }
}

const fetchRepoByName = async (req: Request, res: Response) => {
    const repoName = req.params.name;
    try {
        const repo = await prisma.repository.findUnique({
            where: {
                name: repoName
            },
            include: {
                owner: true,
                issues: true
            }
        });
        if (!repo) {
            res.status(404).json({ message: "Repo not found" });
            return;
        }
        res.status(200).json(repo);

    } catch (error: any) {
        console.error("Error while fetching repo by id", error.message);
        res.status(500).json({ message: "Error while fetching repo by id" });

    }
}

const fetchRepoForCurrentUser = async (req: CustomRequest, res: Response) => {
    const userId = req.user;
    try {
        const repos = await prisma.repository.findMany({
            where: {
                ownerId: parseInt(userId)
            },
            include: {
                owner: true,
                issues: true
            }
        })
        if (!repos || repos.length === 0) {
            res.status(404).json({ message: "Repos not found" });
            return;
        }

        res.status(200).json({ message: "User repos found ", repos });
    } catch (error: any) {
        console.error("Error while fetching repo by id", error.message);
        res.status(500).json({ message: "Error while fetching repo by id" });

    }

}

const updateRepoById = async (req: Request, res: Response) => {
    const repoId = req.params.id;
    const { content, description } = req.body;

    try {
        const repo = await prisma.repository.update({
            where: {
                id: parseInt(repoId)
            },
            data: {
                content: Array.isArray(content) ? content : [content],
                description
            }
        })
        if (!repo) {
            res.status(404).json({ message: "Repo not found" });
            return;
        }
        res.status(200).json({ message: "Repo updated successfully", repo });

    } catch (error: any) {
        console.error("Error while updating repo", error.message);
        res.status(500).json({ message: "Error while updating repo" });

    }
}

const toggleRepoVisibility = async (req: Request, res: Response) => {
    const repoId = req.params.id;
    try {
        const repo = await prisma.repository.findUnique({
            where: {
                id: parseInt(repoId)
            }
        });

        if (!repo) {
            res.status(404).json({ message: "Repo not found" });
            return;
        }

        const updatedRepo = await prisma.repository.update({
            where: {
                id: parseInt(repoId)
            },
            data: {
                visibility: repo.visibility === true ? false : true
            }
        });

        if (!updatedRepo) {
            res.status(500).json({ message: "Error while updating repo visibility" });
            return;
        }

        res.status(200).json({ message: "Repo visibility toggled successfully", updatedRepo });

    } catch (error: any) {
        console.error("Error while updating repo visibility", error.message);
        res.status(500).json({ message: "Error while updating repo visibility" });
    }
}

const deleteRepoById = async (req: Request, res: Response) => {
    const repoId = req.params.id;
    try {
        const repo = await prisma.repository.delete({
            where: {
                id: parseInt(repoId)
            }
        });
        if (!repo) {
            res.status(404).json({ message: "Repo not found" });
            return;
        }
        res.status(200).json({ message: "Repo deleted successfully" });

    } catch (error: any) {
        console.error("Error while deleting repo", error.message);
        res.status(500).json({ message: "Error while deleting repo" });

    }
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