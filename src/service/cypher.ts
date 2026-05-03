import { hmac } from "fast-sha256";

export const base64UrlEncode = (
    arrayBuffer: ArrayBuffer | Uint8Array
): string => {
    let binary = "";
    const bytes =
        arrayBuffer instanceof Uint8Array
            ? arrayBuffer
            : new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

interface CypherPayload {
    cypherCode?: string;
    expirationTime: Date;
    generationTime: Date;
}

export const signToken = async (): Promise<string> => {
    if (!process.env.REACT_APP_SECRET_KEY) {
        throw new Error("REACT_APP_SECRET_KEY is not defined");
    }

    const SECRET_KEY = new TextEncoder().encode(
        process.env.REACT_APP_SECRET_KEY.trim()
    );
    const EXPIRATION_TIME = 1000 * 10; // 10 seconds

    const CYPHER: CypherPayload = {
        cypherCode: process.env.REACT_APP_CYPHER,
        expirationTime: new Date(Date.now() + EXPIRATION_TIME),
        generationTime: new Date(),
    };

    const encoder = new TextEncoder();
    const header = encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = encoder.encode(JSON.stringify(CYPHER));

    const encryptionHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);

    const signatureBuffer = hmac(
        SECRET_KEY,
        encoder.encode(`${encryptionHeader}.${encodedPayload}`)
    );
    const signature = base64UrlEncode(signatureBuffer);

    return `${encryptionHeader}.${encodedPayload}.${signature}`;
};
