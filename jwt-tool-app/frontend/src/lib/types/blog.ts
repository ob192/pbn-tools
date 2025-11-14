export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    publishedAt: string;
}

export interface JWTHeader {
    alg: string;
    typ: string;
    [key: string]: any;
}

export interface JWTPayload {
    [key: string]: any;
}

export interface DecodedJWT {
    header: JWTHeader;
    payload: JWTPayload;
    signature: string;
}