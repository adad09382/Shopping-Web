<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ product.name }}</h1>
      </v-col>
      <v-col cols="12" md="6">
        <v-img :src="product.image"></v-img>
      </v-col>
      <v-col cols="12" md="6">
        <p>${{ product.price }}</p>
        <pre>{{ product.description }}</pre>
        <v-form :disabled="isSubmitting" @submit.prevent="submit">
          <v-text-field
            v-model.number="quantity.value.value"
            type="number"
            label="數量"
            min="0"
            :error-messages="quantity.errorMessage.value"
          ></v-text-field>
          <v-btn type="submit" color="green">加入購物車</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
  <v-overlay
    :model-value="!product.sell"
    persistent
    class="align-center text-center justify-center"
  >
    <h1 class="text-red">已下架</h1>
    <v-btn to="/">回上頁</v-btn>
  </v-overlay>
</template>

<script setup>
import { ref } from "vue";
import { api, apiAuth } from "@/plugins/axios";
import { useRoute } from "vue-router";
import { useSnackbar } from "vuetify-use-dialog";
import * as yup from "yup";
import { useForm, useField } from "vee-validate";
import { useUserStore } from "@/store/user";

const route = useRoute();
const createSnackbar = useSnackbar();
const user = useUserStore();

const schema = yup.object({
  quantity: yup
    .number()
    .typeError("缺少數量")
    .required("缺少數量")
    .min(1, "最少為 1"),
});
const { isSubmitting, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    quantity: 0,
  },
});
const quantity = useField("quantity");

const submit = handleSubmit(async (values) => {
  try {
    const { data } = await apiAuth.post("/users/cart", {
      product: product.value._id,
      quantity: values.quantity,
    });
    user.cart = data.result;
  } catch (error) {
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

const product = ref({
  _id: "",
  name: "",
  price: 0,
  description: "",
  image: "",
  sell: true,
  category: "",
});

(async () => {
  try {
    const { data } = await api.get("/products/" + route.params.id);
    product.value._id = data.result._id;
    product.value.name = data.result.name;
    product.value.price = data.result.price;
    product.value.description = data.result.description;
    product.value.image = data.result.image;
    product.value.sell = data.result.sell;
    product.value.category = data.result.category;

    document.title = "購物網 | " + product.value.name;
  } catch (error) {
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
})();
</script>

<style></style>
