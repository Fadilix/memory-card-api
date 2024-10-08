const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");

const createUser = async (req, res) => {
    const { name, email, password, country } = req.body;
    const userExists = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (userExists) {
        return res.status(400).json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            country
        }
    })
    res.status(201).json({ message: "User created successfully", user: newUser });
}

const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            country: true,
            bestScore: true
        }
    });
    res.status(200).json({ users });
}

const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            country: true,
            bestScore: true
        }
    })
    res.status(200).json({ user });
}

const logUserIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "User logged in successfully", user: { id: user.id, name: user.name, email: user.email } });
}

const updateBestScore = async (req, res) => {
    try {
        const { id } = req.params;
        const { bestScore } = req.body;
        bestScore = parseInt(bestScore);
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { bestScore: parseInt(bestScore) }
        });
        return res.status(200).json({ message: "Best score updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateGamePlayed = async (req, res) => {
    try {
        const { id } = req.params;
        const { gamePlayed } = req.body;
        gamePlayed = parseInt(gamePlayed);
        const currentUser = await prisma.user.findUnique({
            where: { id },
            select: { gamePlayed: true }
        });
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { gamePlayed: currentUser.gamePlayed + parseInt(gamePlayed) }
        });
        return res.status(200).json({ message: "Game played updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = {
    createUser,
    getUsers,
    logUserIn,
    getUserById,
    updateBestScore,
    updateGamePlayed
}
