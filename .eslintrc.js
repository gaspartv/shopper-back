{
  "env": {
  "node": true,
      "jest": true
},
  "extends": [
  "eslint:recommended",
  "plugin:@typescript-eslint/recommended",
  "plugin:prettier/recommended",
  "prettier"
],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
  "ecmaVersion": "latest",
      "sourceType": "module"
},
  "plugins": ["@typescript-eslint/eslint-plugin", "unused-imports", "import"],
    "root": true,
    "ignorePatterns": [".eslintrc.json"],
    "rules": {
  "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": ["warn"],
      "@typescript-eslint/no-unused-vars": [1, { "args": "all" }],
      "prettier/prettier": [
    "error",
    {
      "semi": true,
      "singleQuote": false,
      "tabWidth": 2,
      "printWidth": 80
    }
  ],
      "unused-imports/no-unused-imports": "warn"
}
}
