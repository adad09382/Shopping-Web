<template>
  <v-card>
    <VImg :src="image" cover height="200"></VImg>
    <v-card-title>
      <router-link
        :to="'/products/' + _id"
        class="text-primary text-decoration-none"
        >{{ name }}
      </router-link>
    </v-card-title>
    <v-card-subtitle>${{ price }}</v-card-subtitle>
    <v-card-text>
      <pre
        >{{ description }}
        </pre
      >
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" prepend-icon="mdi-cart" @click="addCart"
        >加入購物車</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps } from "vue";
import { apiAuth } from "@/plugins/axios";
import { useUserStore } from "@/store/user";
import { useSnackbar } from "vuetify-use-dialog";

const createSnackbar = useSnackbar();
const user = useUserStore();

const props = defineProps({
  _id: {
    type: String,
    default: () => "",
  },
  category: {
    type: String,
    default: () => "",
  },
  description: {
    type: String,
    default: () => "",
  },
  image: {
    type: String,
    default: () => "",
  },
  name: {
    type: String,
    default: () => "",
  },
  price: {
    type: Number,
    default: () => 0,
  },
  sell: {
    type: Boolean,
    default: () => true,
  },
});

const addCart = async () => {
  try {
    const { data } = await apiAuth.post("/users/cart", {
      product: props._id,
      quantity: 1,
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
};
</script>
