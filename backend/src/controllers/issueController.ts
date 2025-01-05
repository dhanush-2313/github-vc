import { Request, Response } from 'express';
import prisma from '../config/prismaClient';
import { CustomRequest } from './repoController';

const createIssue = async (req: CustomRequest, res: Response) => {
    const { title, description } = req.body;
    const repoId = req.params.id;
    try {
        if (!title || !description) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }
        const issue = await prisma.issue.create({
            data: {
                title,
                description,
                repository: {
                    connect: { id: parseInt(repoId) }
                }
            }
        });
        res.status(201).json({ message: 'Issue created successfully', issueId: issue.id });
    } catch (error: any) {
        console.error('Error while creating issue', error.message);
        res.status(500).json({ message: 'Error while creating issue' });

    }
}

const updateIssue = async (req: Request, res: Response) => {
    const issueId = req.params.id;
    const { title, description, status } = req.body;
    try {
        const issue = await prisma.issue.update({
            where: {
                id: parseInt(issueId)
            },
            data: {
                title,
                description,
                status
            }
        });
        if (!issue) {
            res.status(404).json({ message: 'Issue not found' });
            return;
        }
        res.status(200).json({
            message: 'Issue updated successfully', issueId: issue
        })
    } catch (error: any) {
        console.error('Error while updating issue', error.message);
        res.status(500).json({ message: 'Error while updating issue' });
    }
}

const deleteIssue = async (req: Request, res: Response) => {
    const issueId = req.params.id;
    try {
        const issue = await prisma.issue.delete({
            where: {
                id: parseInt(issueId)
            }
        });
        if (!issue) {
            res.status(404).json({ message: 'Issue not found' });
            return;
        }
        res.status(200).json({ message: 'Issue deleted successfully' });
    } catch (error: any) {
        console.error('Error while deleting issue', error.message);
        res.status(500).json({ message: 'Error while deleting issue' });

    }
}

const getAllIsuues = async (req: Request, res: Response) => {
    const repoId = req.params.id;
    try {
        const issues = await prisma.issue.findMany({
            where: {
                repositoryId: parseInt(repoId)
            }
        });
        if (!issues) {
            res.status(404).json({ message: 'No issues found' });
            return;
        }
        res.status(200).json({ issues });
    } catch (error: any) {
        console.error('Error while fetching issues', error.message);
        res.status(500).json({ message: 'Error while fetching issues' });
    }
}

const getIssueById = async (req: Request, res: Response) => {
    const issueId = req.params.id;
    try {
        const issue = await prisma.issue.findUnique({
            where: {
                id: parseInt(issueId)
            }
        });
        if (!issue) {
            res.status(404).json({ message: 'Issue not found' });
            return;
        }
        res.status(200).json({ issue });
    } catch (error: any) {
        console.error('Error while fetching issue', error.message);
        res.status(500).json({ message: 'Error while fetching issue' });
    }
}

export const issueController = {
    createIssue,
    updateIssue,
    deleteIssue,
    getAllIsuues,
    getIssueById
}