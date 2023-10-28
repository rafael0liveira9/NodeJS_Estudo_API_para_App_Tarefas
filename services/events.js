const { jwtUncrypt } = require('./midleware/authentication'),
    { PrismaClient } = require("@prisma/client"),
    p = new PrismaClient(),
    { verify, sign } = require("jsonwebtoken"),
    { compareSync, hashSync } = require('bcryptjs'),
    error = {
        status: 500,
        message: "Erro Interno"
    },

    // **************************************** CREATE CATEGORY
    createCategory = async (body, auth) => {

        let x = await jwtUncrypt(auth);

        if (!!x.user.email) {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: x.user.email,
                    deletedAt: null
                }
            })

            if (!alreadyUser) {
                return {
                    status: 400,
                    message: "Usuário não existe"
                }
            }

            try {

                const event = await p.category.create({
                    data: {
                        name: body.name,
                        createdAt: new Date(),
                        updatedAt: null,
                        deletedAt: null
                    }
                })
                return event

            } catch (error) {
                return {
                    status: 400,
                    message: "Erro ao criar Lista"
                }
            }



        } else {
            console.log(error, "Erro ao criar Lista");
            return error;
        }
    },

    // **************************************** UPDATE CATEGORY
    updateCategory = async (body, auth) => {

        let x = await jwtUncrypt(auth);

        if (!!x.user.email) {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: x.user.email,
                    deletedAt: null
                }
            })

            if (!alreadyUser) {
                return {
                    status: 400,
                    message: "Usuário não existe"
                }
            }

            const alreadyList = await p.category.findFirst({
                where: {
                    id: body.id,
                    deletedAt: null
                }
            })

            if (!alreadyList) {
                return {
                    status: 400,
                    message: "Categoria não existe"
                }
            }

            try {

                const list = await p.category.update({
                    where: {
                        id: alreadyList.id
                    },
                    data: {
                        name: body.name,
                        updatedAt: new Date()
                    }
                })

                return list

            } catch (error) {
                return {
                    status: 400,
                    message: "Erro ao criar Lista"
                }
            }



        } else {
            console.log(error, "Erro ao criar Lista");
            return error;
        }
    },

    // **************************************** DELETE CATEGORY
    deleteCategory = async (body, auth) => {

        let x = await jwtUncrypt(auth);

        if (!!x.user.email) {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: x.user.email,
                    deletedAt: null
                }
            })

            if (!alreadyUser) {
                return {
                    status: 400,
                    message: "Usuário não existe"
                }
            }

            const alreadyList = await p.category.findFirst({
                where: {
                    id: body.id,
                    deletedAt: null
                }
            })

            if (!alreadyList) {
                return {
                    status: 400,
                    message: "Lista não existe"
                }
            }

            try {

                const list = await p.category.update({
                    where: {
                        id: alreadyList.id
                    },
                    data: {
                        deletedAt: new Date()
                    }
                })

                return list

            } catch (error) {
                return {
                    status: 400,
                    message: "Erro ao criar Lista"
                }
            }



        } else {
            console.log(error, "Erro ao criar Lista");
            return error;
        }
    },

    // **************************************** GET CATEGORY
    getCategory = async (auth) => {
        let x = await jwtUncrypt(auth);

        if (!!x.user.email) {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: x.user.email,
                    deletedAt: null
                }
            })

            if (!alreadyUser) {
                return {
                    status: 400,
                    message: "Usuário não existe"
                }
            }

            try {

                const list = await p.category.findMany({
                    where: {
                        deletedAt: null
                    }
                })

                return list

            } catch (error) {
                return {
                    status: 400,
                    message: "Erro ao criar Lista"
                }
            }



        } else {
            console.log(error, "Erro ao criar Lista");
            return error;
        }
    },

    // **************************************** CREATE EVENT
    createEvent = async (body, auth) => {

        let x = await jwtUncrypt(auth);

        if (!!x.user.email) {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: x.user.email,
                    deletedAt: null
                }
            })

            if (!alreadyUser) {
                return {
                    status: 400,
                    message: "Usuário não existe"
                }
            }

            try {

                const event = await p.event.create({
                    data: {
                        userId: x.user.id,
                        name: body.name,
                        description: body.description,
                        categoryId: body.categoryId,
                        createdAt: new Date(),
                        updatedAt: null,
                        deletedAt: null
                    }
                })
                return event

            } catch (error) {
                return {
                    status: 400,
                    message: "Erro ao criar Lista"
                }
            }



        } else {
            console.log(error, "Erro ao criar Lista");
            return error;
        }
    },

    // **************************************** UPDATE EVENT
    updateEvent = async (body, auth) => {

        let x = await jwtUncrypt(auth);

        if (!!x.user.email) {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: x.user.email,
                    deletedAt: null
                }
            })

            if (!alreadyUser) {
                return {
                    status: 400,
                    message: "Usuário não existe"
                }
            }

            const alreadyList = await p.event.findFirst({
                where: {
                    id: body.id,
                    deletedAt: null
                }
            })

            if (!alreadyList) {
                return {
                    status: 400,
                    message: "Evento não existe"
                }
            }

            try {

                const list = await p.event.update({
                    where: {
                        id: alreadyList.id
                    },
                    data: {
                        name: body.name,
                        description: body.description,
                        categoryId: body.categoryId,
                        updatedAt: new Date(),
                    }
                })

                return list

            } catch (error) {
                return {
                    status: 400,
                    message: "Erro ao criar Lista"
                }
            }



        } else {
            console.log(error, "Erro ao criar Lista");
            return error;
        }
    },

    // **************************************** DELETE EVENT
    deleteEvent = async (body, auth) => {

        let x = await jwtUncrypt(auth);

        if (!!x.user.email) {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: x.user.email,
                    deletedAt: null
                }
            })

            if (!alreadyUser) {
                return {
                    status: 400,
                    message: "Usuário não existe"
                }
            }

            const alreadyList = await p.event.findFirst({
                where: {
                    id: body.id,
                    deletedAt: null
                }
            })

            if (!alreadyList) {
                return {
                    status: 400,
                    message: "Lista não existe"
                }
            }

            try {

                const list = await p.event.update({
                    where: {
                        id: alreadyList.id
                    },
                    data: {
                        deletedAt: new Date()
                    }
                })

                return list

            } catch (error) {
                return {
                    status: 400,
                    message: "Erro ao criar Lista"
                }
            }



        } else {
            console.log(error, "Erro ao criar Lista");
            return error;
        }
    },

    // **************************************** GET CATEGORY
    getEvents = async (auth) => {
        let x = await jwtUncrypt(auth);

        if (!!x.user.email) {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: x.user.email,
                    deletedAt: null
                }
            })

            if (!alreadyUser) {
                return {
                    status: 400,
                    message: "Usuário não existe"
                }
            }

            try {

                const list = await p.event.findMany({
                    where: {
                        userId: alreadyUser.id,
                        deletedAt: null
                    }
                })

                return list

            } catch (error) {
                return {
                    status: 400,
                    message: "Erro ao pegar Lista"
                }
            }



        } else {
            console.log(error, "Erro ao criar Lista");
            return error;
        }
    }

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, createEvent, updateEvent, deleteEvent, getEvents };