export const constants = {
    tableLimits: {
        vendors: {
            name: 500,
            address: 500,
            description: 3000,
            email: 200
        }
    },
    errorCodes: {
        emailExists: "1",
        emailDoesNotExists: "2",
        noError: "0",
        invalidCreds: "3",
        profileAlreadyCreated: "4",
        unknownError: "1000"
    },
    esEvents: {
        create: "CREATE",
        update: "UPDATE",
        delete: "DELETE"
    }
}
