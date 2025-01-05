import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

const createIssue = async (req: Request, res: Response) => {
    res.send('Issue created');
}

const updateIssue = async (req: Request, res: Response) => {
    res.send('Issue updated');
}

const deleteIssue = async (req: Request, res: Response) => {
    res.send('Issue deleted');
}

const getAllIsuues = async (req: Request, res: Response) => {
    res.send('All issues fetched');
}

const getIssueById = async (req: Request, res: Response) => {
    res.send('Issue fetched');
}

export const issueController = {
    createIssue,
    updateIssue,
    deleteIssue,
    getAllIsuues,
    getIssueById
}