<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>註冊</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-form :disabled="isSubmitting" @submit.prevent="submit">
          <V-text-field
            v-model="account.value.value"
            :error-messages="account.errorMessage.value"
            label="帳號"
            counter
            maxlength="20"
          ></V-text-field>
          <v-text-field
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="信箱"
            type="email"
          ></v-text-field>
          <v-text-field
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            label="密碼"
            counter
            maxlength="20"
            type="password"
          ></v-text-field>
          <v-text-field
            v-model="passwordConfirm.value.value"
            :error-messages="passwordConfirm.errorMessage.value"
            label="確認密碼"
            counter
            maxlength="20"
            type="password"
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
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { api } from "@/plugins/axios";
import { useSnackbar } from "vuetify-use-dialog";
import { useRouter } from "vue-router";

const createSnackbar = useSnackbar();
const router = useRouter();

const schema = yup.object({
  account: yup
    .string()
    .required("帳號必填寫")
    .min(4, "帳號最少4字")
    .max(20, "帳號最多20字"),
  email: yup
    .string()
    .required("信箱必填寫")
    .test("isEmail", "信箱格式錯誤", (value) => validator.isEmail(value)),
  password: yup
    .string()
    .required("密碼必填寫")
    .min(4, "密碼最少4字")
    .max(20, "密碼最多20字")
    .oneOf([yup.ref("password")], "密碼不一致"),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
});

const account = useField("account");
const email = useField("email");
const password = useField("password");
const passwordConfirm = useField("passwordConfirm");

const submit = handleSubmit(async (values) => {
  try {
    await api.post("/users", {
      account: values.account,
      email: values.email,
      password: values.password,
    });
    createSnackbar({
      text: "註冊成功",
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "green",
        location: "bottom",
      },
    });
    router.push("/login");
  } catch (error) {
    console.log(error);
    createSnackbar({
      text: error.response.data.message,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "red",
        location: "bottom",
      },
    });
  }
});
</script>
