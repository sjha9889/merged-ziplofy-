interface Config {
    allowedOrigins: (string | RegExp)[];
    clientUrl: string;
}

const NODE_ENV = process.env.NODE_ENV || 'development';

let config: Config;

if (NODE_ENV === 'development') {
    config = {
        allowedOrigins: [
            "http://localhost:5173",
            "http://localhost:5174",
            // Allow any subdomain of localhost:5173 (e.g., foo.localhost:5173)
            /^http:\/\/([a-z0-9-]+\.)*localhost:5173$/i,
            // If you also run https locally via proxy/certs
            /^https:\/\/([a-z0-9-]+\.)*localhost:5173$/i,
        ],
        clientUrl: "http://localhost:5173"
    };
} else {
    config = {
        allowedOrigins: [
            // Adjust for production admin domain patterns if needed
        ],
        clientUrl: "http://localhost:5173"
    };
}

export { config };


