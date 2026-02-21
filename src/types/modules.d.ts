declare module 'oracledb' {
  const oracledb: unknown;
  export default oracledb;
}

declare module 'module-alias' {
  function addAliases(aliases: Record<string, string>): void;
  export { addAliases };
}
