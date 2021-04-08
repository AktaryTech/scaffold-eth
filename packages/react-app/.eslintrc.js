module.exports = {
  env: {
    browser: true,
  },
  extends: ["airbnb", "plugin:prettier/recommended", "prettier/react"],
  plugins: ["babel"],
  rules: {
    "prettier/prettier": ["error"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/prefer-default-export": "off",
    "prefer-destructuring": "off",
    "prefer-template": "off",
    "no-underscore-dangle": "off",
    "react/prop-types": "off",
    "react/destructuring-assignment": "off",
    "react-hooks/exhaustive-deps": ["off"],
    "no-console": "off",
    "no-nested-ternary": "off",
    "consistent-return": "off",
    "jsx-a11y/accessible-emoji": ["off"],
    "jsx-a11y/no-static-element-interactions": ["off"],
    "jsx-a11y/click-events-have-key-events": ["off"],
  },
};
