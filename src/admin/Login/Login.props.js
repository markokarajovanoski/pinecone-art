/**
 * @typedef {object} LoginViewProps
 * @property {string} email
 * @property {string} password
 * @property {boolean} busy
 * @property {boolean} failed  the last attempt was rejected
 * @property {(value: string) => void} onEmailChange
 * @property {(value: string) => void} onPasswordChange
 * @property {(event: import('react').FormEvent) => void} onSubmit
 */
