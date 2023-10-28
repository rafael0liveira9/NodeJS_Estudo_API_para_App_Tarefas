const { jwtUncrypt } = require('./midleware/authentication'),
    { PrismaClient } = require("@prisma/client"),
    p = new PrismaClient(),
    { verify, sign } = require("jsonwebtoken"),
    { compareSync, hashSync } = require('bcryptjs'),
    error = {
        status: 500,
        message: "Erro Interno"
    },

    // **************************************** CREATE LIST
    createList = async (body, auth) => {

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

                const list = await p.taskList.create({
                    data: {
                        userId: alreadyUser.id,
                        parentId: body.id,
                        name: body.name,
                        description: body.description,
                        maxDateValidate: new Date(),
                        createdAt: new Date(),
                        updatedAt: null,
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

    // **************************************** UPDATE LIST
    updateList = async (body, auth) => {

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

            const alreadyList = await p.taskList.findFirst({
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

                const list = await p.taskList.update({
                    where: {
                        id: alreadyList.id
                    },
                    data: {
                        name: body.name,
                        description: body.description,
                        maxDateValidate: new Date(),
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

    // **************************************** DELETE LIST
    deleteList = async (body, auth) => {

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

            const alreadyList = await p.taskList.findFirst({
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

                const list = await p.taskList.update({
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

    // **************************************** CREATE TASK
    createTask = async (body, auth) => {

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

            // try {

            const task = await p.task.create({
                data: {
                    listId: body.listId,
                    name: body.name,
                    description: body.description,
                    value: body.value || 0,
                    createdAt: new Date(),
                    updatedAt: null,
                    deletedAt: null
                }
            })
            return task

            // } catch (error) {
            //     return {
            //         status: 400,
            //         message: "Erro ao criar Lista"
            //     }
            // }



        } else {
            console.log(error, "Erro ao criar Lista");
            return error;
        }
    },

    // **************************************** UPDATE TASK
    updateTask = async (body, auth) => {

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

            const alreadyList = await p.task.findFirst({
                where: {
                    listId: body.id,
                    deletedAt: null
                }
            })

            if (!alreadyList) {
                return {
                    status: 400,
                    message: "Task não existe"
                }
            }

            try {

                const list = await p.task.update({
                    where: {
                        id: alreadyList.id
                    },
                    data: {
                        name: body.name,
                        description: body.description,
                        value: body.value,
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

    // **************************************** DELETE TASK
    deleteTask = async (body, auth) => {

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

            const alreadyList = await p.task.findFirst({
                where: {
                    id: body.id,
                    deletedAt: null
                }
            })

            if (!alreadyList) {
                return {
                    status: 400,
                    message: "Task não existe"
                }
            }

            try {

                const list = await p.task.update({
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
    }

module.exports = { createList, updateList, deleteList, createTask, updateTask, deleteTask };