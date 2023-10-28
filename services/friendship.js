const { jwtUncrypt } = require('./midleware/authentication'),
    { PrismaClient } = require("@prisma/client"),
    p = new PrismaClient(),
    error = {
        status: 500,
        message: "Erro Interno"
    },

    // **********************************************************************  FRIEND VERIFY
    verifyFriend = async (body, auth) => {
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
                    status: 409,
                    message: "Usuário não Autênticado"
                }
            }

            try {
                const blocked = await p.friendship.findFirst({
                    where: {
                        AND: [
                            { creatorUser: alreadyUser.id },
                            { userReceived: body.id }
                        ]
                    }
                })

                return blocked

            } catch (error) {
                console.log(error, "Erro ao verificar");
                return error;
            }
        } else {
            return {
                status: 409,
                message: "Usuário sem Autorização"
            }
        }

    },

    // ********************************************************************** ADD FRIEND
    addFriend = async (body, auth) => {

        let x = await jwtUncrypt(auth);

        let y = await verifyFriend(body, auth);

        const blocked = await p.blockList.findFirst({
            where: {
                AND: [
                    { userOne: x.id },
                    { userTwo: body.id }
                ]
            }
        })

        if (!!blocked) {
            return { status: 401, message: "Usuário Bloqueado, não é possivel adicionar" }
        }

        if (!!y) {
            return { status: 401, message: "Não foi possivel prosseguir" }
        }

        if (!!x.user.email) {

            const alreadyUser = await p.user.findFirst({
                where: {
                    email: x.user.email,
                    deletedAt: null
                }
            })

            if (!alreadyUser) {
                return {
                    status: 409,
                    message: "Usuário não Autênticado"
                }
            }

            try {
                const desc = await p.friendship.create({
                    data: {
                        creatorUser: alreadyUser.id,
                        userReceived: body.id,
                        type: body.type,
                        createdAt: new Date(),
                    }
                })

                return desc

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

    // ********************************************************************** REMOVE FRIEND
    removeFriend = async (body, auth) => {

        let x = await jwtUncrypt(auth);

        let y = await verifyFriend(body, auth);

        if (!y) {
            return { status: 200, message: "Não foi possivel prosseguir" }
        }

        if (!!x.user.email) {

            try {
                const removing = await p.friendship.delete({
                    where: {
                        id: y.id
                    }
                })

                return {
                    status: 200,
                    message: "Amizade dissolvida com sucesso"
                }

            } catch (error) {
                console.log(error, "Erro ao remover bloqueio user");
                return error;
            }
        } else {
            return {
                status: 409,
                message: "Usuário sem Autorização"
            }
        }
    },
    // **********************************************************************  FRIEND VERIFY
    getFriend = async (auth) => {
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
                    status: 409,
                    message: "Usuário não Autênticado"
                }
            }

            try {
                const friends = await p.friendship.findMany({
                    where: {
                        creatorUser: alreadyUser.id
                    }
                })

                return friends

            } catch (error) {
                console.log(error, "Erro ao verificar");
                return error;
            }
        } else {
            return {
                status: 409,
                message: "Usuário sem Autorização"
            }
        }

    }


module.exports = { verifyFriend, addFriend, removeFriend, getFriend };