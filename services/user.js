const { jwtUncrypt } = require('./midleware/authentication'),
    { PrismaClient } = require("@prisma/client"),
    p = new PrismaClient(),
    { verify, sign } = require("jsonwebtoken"),
    { compareSync, hashSync } = require('bcryptjs'),
    error = {
        status: 500,
        message: "Erro Interno"
    },

    // **************************************** LOGIN USER
    signIn = async (body) => {

        try {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: body.email,
                    deletedAt: null
                }
            })

            if (!alreadyUser) {
                await p.$disconnect();
                return {
                    status: 400,
                    message: "Usuário não existe"
                }
            }


            alreadyUser.token = sign({ id: alreadyUser.id, email: alreadyUser.email }, process.env.SECRET_CLIENT_KEY)
            let res = {
                status: 200,
                message: "Usuário Logado Sucesso",
                user: {
                    id: alreadyUser.id,
                    name: alreadyUser.name,
                    email: alreadyUser.email,
                    jwt: alreadyUser.token
                }
            }

            await p.$disconnect();
            return res



        } catch (error) {
            console.log(error, "Erro ao cadastrar user");
            return error;
        }
    },

    // **************************************** NEW USER
    newUser = async (body) => {

        if (!!body.email && !!body.password) {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: body.email,
                    deletedAt: null
                }
            })

            if (!!alreadyUser) {
                return {
                    status: 409,
                    message: "E-mail já cadastrado"
                }
            }

            try {

                const desc = await p.user.create({
                    data: {
                        firstName: body.firstName,
                        lastName: body.lastName,
                        nickName: body.firstName,
                        email: body.email,
                        description: `Hi, im ${body.firstName} ${body.lastName}, nice to meet you!`,
                        password: hashSync(body.password, 8),
                        userType: 1,
                        createdAt: new Date(),
                        updatedAt: null,
                        deletedAt: null
                    }
                })

                let token = sign({ id: desc.id, email: desc.email }, process.env.SECRET_CLIENT_KEY)

                await p.$disconnect();

                return { status: 200, jwt: token, user: desc }

            } catch (error) {
                console.log(error, "Erro ao cadastrar user");
                return error;
            }
        } else {
            return { status: 401, message: "Faltando dados para cadastro" }
        }
    },

    // **************************************** UPDATE USER
    updateUser = async (body, auth) => {

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

            const updated = {
                firstName: body.firstName ? body.firstName : alreadyUser.firstName,
                lastName: body.lastName ? body.lastName : alreadyUser.lastName,
                nickName: body.nickName ? body.nickName : alreadyUser.nickName,
                email: body.email ? body.email : alreadyUser.email,
                description: body.description ? body.description : alreadyUser.description,
                phone: body.phone ? body.phone : alreadyUser.phone,
                avatarImage: body.avatarImage ? body.avatarImage : alreadyUser.avatarImage,
                backgroundImage: body.backgroundImage ? body.backgroundImage : alreadyUser.backgroundImage,
                updatedAt: new Date(),
            }

            try {
                const user = await p.user.update({
                    where: {
                        id: alreadyUser.id
                    },
                    data: updated
                })

                let jwt = sign({ id: user.id, email: user.email }, process.env.SECRET_CLIENT_KEY);

                await p.$disconnect();

                return { user, jwt }

            } catch (error) {
                console.log(error, "Erro ao editar user");
                return error;
            }
        } else {
            return {
                status: 409,
                message: "Usuário sem Autorização"
            }
        }
    },

    // **************************************** DELETE USER
    deleteUser = async (auth) => {

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
                const desc = await p.user.update({
                    where: {
                        id: alreadyUser.id
                    },
                    data: {
                        firstName: "Usuário",
                        lastName: "Desconhecido",
                        nickName: "Usuário Desconhecido",
                        email: "undefined",
                        description: null,
                        phone: null,
                        avatarImage: null,
                        backgroundImage: null,
                        updatedAt: new Date(),
                        deletedAt: new Date()
                    }
                })

                await p.$disconnect();
                return { status: 200, message: "Usuário deletado com Sucesso!", res: desc }

            } catch (error) {
                console.log(error, "Erro ao editar user");
                return error;
            }
        } else {
            return {
                status: 409,
                message: "Usuário sem Autorização"
            }
        }
    },

    // **************************************** UPDATE USER
    increasePoints = async (body, auth) => {

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

            const updated = {
                points: alreadyUser.points + body.points,
                updatedAt: new Date(),
            }


            try {
                const user = await p.user.update({
                    where: {
                        id: alreadyUser.id
                    },
                    data: updated
                })

                await p.$disconnect();

                return { status: 200, message: `${body.points} pontos inseridos.` }

            } catch (error) {
                console.log(error, "Erro ao editar user");
                return error;
            }
        } else {
            return {
                status: 409,
                message: "Usuário sem Autorização"
            }
        }
    },

    // **************************************** UPDATE USER
    decreasePoints = async (body, auth) => {

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

            console.log((+alreadyUser.points - body.points) <= 0)

            const updated = {
                points: alreadyUser.points - body.points,
                updatedAt: new Date(),
            }

            console.log(updated)

            try {
                const user = await p.user.update({
                    where: {
                        id: alreadyUser.id
                    },
                    data: updated
                })

                await p.$disconnect();

                if (user.points < 0) {

                    const userTwo = await p.user.update({
                        where: {
                            id: alreadyUser.id
                        },
                        data: {
                            points: 0,
                            updatedAt: new Date(),
                        }
                    })

                    return { status: 200, message: `${body.points} pontos retirados.` }
                } else {
                    return { status: 200, message: `${body.points} pontos retirados.` }
                }



            } catch (error) {
                console.log(error, "Erro ao editar user");
                return error;
            }
        } else {
            return {
                status: 409,
                message: "Usuário sem Autorização"
            }
        }
    },

    // **************************************** NEW USER
    newChild = async (body, auth) => {


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

            if (!!body.email && !!body.password) {

                const alreadyEmail = await p.user.findFirst({
                    where: {
                        email: body.email,
                        deletedAt: null
                    }
                })

                if (!!alreadyEmail) {
                    return {
                        status: 409,
                        message: "E-mail já cadastrado"
                    }
                }

                try {

                    const desc = await p.user.create({
                        data: {
                            firstName: body.firstName,
                            lastName: body.lastName,
                            nickName: body.firstName,
                            email: body.email,
                            description: `Hi, im ${body.firstName} ${body.lastName}, nice to meet you!`,
                            password: hashSync(body.password, 8),
                            userType: 1,
                            createdAt: new Date(),
                            updatedAt: null,
                            deletedAt: null
                        }
                    })

                    const friend = await p.friendship.create({
                        data: {
                            creatorUser: alreadyUser.id,
                            userReceived: desc.id,
                            type: 1,
                            createdAt: new Date(),
                        }
                    })


                    await p.$disconnect();

                    return { status: 200, user: desc, parent: friend }

                } catch (error) {
                    console.log(error, "Erro ao cadastrar user");
                    return error;
                }
            } else {
                return { status: 401, message: "Faltando dados para cadastro" }
            }
        }
    }

module.exports = { signIn, newUser, updateUser, deleteUser, increasePoints, decreasePoints, newChild };