const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

async function getSecretValue(secretName) {
    const client = new SecretsManagerClient({ region: "eu-west-3" });
    let response;
    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
    } catch (error) {
        console.error("Error fetching secret:", error);
        process.exit(1); // Exit with an error status
    }

    return response.SecretString || response.SecretBinary.toString('base64');
}

async function printConnectionString() {
    const secretName = "thinkPaladar-db"; // Replace with your secret name
    const secret = await getSecretValue(secretName);

    if (secret) {
        const dbCredentials = JSON.parse(secret);
        const { username, password, host, port, dbname } = dbCredentials;

        // Construct the PostgreSQL connection string
        const dbConnectionString = `postgres://${username}:${password}@${host}:${port}/postgres`;
        console.log(dbConnectionString);
    } else {
        console.error("Secret not found.");
    }
}

printConnectionString();