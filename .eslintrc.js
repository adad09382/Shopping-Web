module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["prettier", "plugin:vue/vue3-essential", "eslint:recommended"],
  rules: {
    "vue/no-multiple-template-root": 0,
  },
};
