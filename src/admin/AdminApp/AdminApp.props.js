/**
 * Where the visitor is in the sign-in flow.
 * @typedef {'notConfigured' | 'loading' | 'signedOut' | 'notAdmin' | 'admin'} AdminState
 */

/**
 * @typedef {object} AdminAppViewProps
 * @property {AdminState} state
 * @property {string | undefined} email  the signed-in account
 * @property {'orders' | 'pieces' | 'settings'} tab
 * @property {(tab: 'orders' | 'pieces' | 'settings') => void} onSelectTab
 * @property {() => void} onSignOut
 */
