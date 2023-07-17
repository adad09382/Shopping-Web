<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>註冊</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-form v-model="valid" @submit.prevent="register">
          <V-text-field
            v-model="form.account"
            label="帳號"
            counter
            maxlength="20"
            :rules="[rules.required, rules.min, rules.max]"
          ></V-text-field>
          <v-text-field
            v-model="form.email"
            label="信箱"
            type="email"
            :rules="[rules.required, rules.email]"
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            label="密碼"
            counter
            maxlength="20"
            type="password"
            :rules="[rules.required, rules.min, rules.max, rules.confirm]"
            ref="elPassword"
            @update:modelValue="elPasswordConfirm.validate()"
          ></v-text-field>
          <v-text-field
            v-model="form.confirmPassword"
            label="確認密碼"
            counter
            maxlength="20"
            type="password"
            :rules="[rules.required, rules.min, rules.max, rules.confirm]"
            ref="elPasswordConfirm"
            @update:modelValue="elPassword.validate()"
          ></v-text-field>
          <div class="text-center">
            <VBtn type="submit" color="green">註冊</VBtn>
          </div>
        </v-form>
      </v-col>
      <v-col cols="12"></v-col>
      <v-col cols="12"></v-col>
      <v-col cols="12"></v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref } from "vue";
import validator from "validator";

const valid = ref(false);
const form = reactive({
  account: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const elPassword = ref(null);
const elPasswordConfirm = ref(null);

const rules = {
  required: (value) => !!value || "欄位必填",
  email: (value) => validator.isEmail(value) || "格式錯誤",
  min: (value) => value.length >= 4 || "長度必須大於 4 個字",
  max: (value) => value.length <= 20 || "長度必須小於 20 個字",
  confirm: (value) => value === form.password || "密碼不一致",
};

function register() {}
</script>
