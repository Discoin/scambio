// This is a monkey patch so AVA wil compile without errors
// See this GitHub issue for context https://github.com/avajs/ava/issues/2332
// See this reply for the source of this code https://github.com/avajs/ava/issues/2332#issuecomment-570442898
declare interface SymbolConstructor {
	readonly observable: symbol;
}
