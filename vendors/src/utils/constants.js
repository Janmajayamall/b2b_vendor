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
        recordNotFound: "5",
        unknownError: "1000"
    },
    B2B_BUCKET_S3_PUBLIC_URL: "https://b2b-vbc.s3.ap-south-1.amazonaws.com"
}
