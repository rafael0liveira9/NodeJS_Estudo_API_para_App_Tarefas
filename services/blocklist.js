const { jwtUncrypt } = require('./midleware/authentication'),
    { verifyFriend } = require('./friendship'),
    { PrismaClient } = require("@prisma/client"),
    p = new PrismaClient(),
    error = {
        status: 500,
        message: "Erro Interno"
    },

    // **********************************************************************  BLOCK VERIFY
    verifyBlock = async (body, auth) => {
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
                const blocked = await p.blockList.findFirst({
                    where: {
                        AND: [
                            { userOne: alreadyUser.id },
                            { userTwo: body.id }
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

    // ********************************************************************** ADD BLOCK
    addBlock = async (body, auth) => {

        let x = await jwtUncrypt(auth);

        let y = await verifyBlock(body, auth);

        let z = await verifyFriend(body, auth);

        if (!!y) {
            return { status: 200, message: "Não foi possivel prosseguir" }
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
                const removing = await p.friendship.delete({
                    where: {
                        id: z.id
                    }
                })

                const desc = await p.blockList.create({
                    data: {
                        userOne: alreadyUser.id,
                        userTwo: body.id,
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

    // ********************************************************************** REMOVE BLOCK
    removeBlock = async (body, auth) => {

        let x = await jwtUncrypt(auth);

        let y = await verifyBlock(body, auth);

        if (!y) {
            return { status: 200, message: "Não foi possivel prosseguir" }
        }

        if (!!x.user.email) {

            try {
                const removing = await p.blockList.delete({
                    where: {
                        id: y.id
                    }
                })

                return removing

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
    // **********************************************************************  BLOCK VERIFY
    getBlock = async (auth) => {
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
                const blocked = await p.blockList.findMany({
                    where: {
                        userOne: alreadyUser.id
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

    }


module.exports = { addBlock, removeBlock, getBlock, verifyBlock };