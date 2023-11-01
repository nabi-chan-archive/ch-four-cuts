/** @type {import('prettier').Config} */

export default {
  htmlWhitespaceSensitivity: 'ignore',
  printWidth: 120,
  singleQuote: true,
  quoteProps: 'consistent',

  xmlWhitespaceSensitivity: 'ignore',
  xmlQuoteAttributes: 'double',

  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-prisma', '@prettier/plugin-xml'],
};
