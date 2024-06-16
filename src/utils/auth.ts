const AuthorizationHeaderFromEmailAndPassword = (
    email: string,
    password: string,
): string => `Basic ${btoa(`${email}:${password}`)}`;

export { AuthorizationHeaderFromEmailAndPassword };
