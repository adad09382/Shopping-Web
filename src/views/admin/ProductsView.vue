<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">商品管理</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-btn color="green" @click="openDialog">新增商品</v-btn>
        <VDataTableServer
          v-model:items-per-page="tableItemsPerPage"
          v-model:sort-by="tableSortBy"
          v-model:page="tablePage"
          :items="tableProducts"
          :headers="tableHeaders"
          :loading="tableLoading"
          :items-length="tableItemsLength"
          :search="tableSearch"
          hover
          @update:items-per-page="tableLoadItems"
          @update:sort-by="tableLoadItems"
          @update:page="tableLoadItems"
        >
          <template #top>
            <VTextField
              label="搜尋"
              append-icon="mdi-magnify"
              @click:append="tableApplySearch"
              @keydown.enter="tableApplySearch"
              v-model="tableSearch"
            ></VTextField>
          </template>
          <template #[`item.image`]="{ item }">
            <VImg :src="item.raw.image" height="50px"></VImg>
          </template>
          <template #[`item.sell`]="{ item }">
            <VIcon icon="mdi-check" v-if="item.raw.sell"></VIcon>
          </template>
          <template #[`item.edit`]="{ item }">
            <VBtn
              icon="mdi-pencil"
              @click="tableEditItem(item.raw)"
              variant="text"
            ></VBtn>
          </template>
        </VDataTableServer>
      </v-col>
      <v-col cols="12"></v-col>
      <v-col cols="12"></v-col>
    </v-row>
  </v-container>
  <v-dialog persistent v-model="dialog" width="500px">
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card>
        <v-card-title>新增商品</v-card-title>
        <v-card-text>
          <VTextField
            label="名稱"
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
          ></VTextField>
          <v-text-field
            label="價格"
            v-model.number="price.value.value"
            :error-messages="price.errorMessage.value"
            type="number"
            min="0"
          ></v-text-field>
          <v-text-field
            label="說明"
            v-model.number="description.value.value"
            :error-messages="description.errorMessage.value"
          ></v-text-field>
          <v-select
            label="分類"
            v-model.number="category.value.value"
            :error-messages="category.errorMessage.value"
            :items="categories"
          ></v-select>
          <VCheckbox
            label="上架"
            v-model.number="sell.value.value"
            :error-messages="sell.errorMessage.value"
          ></VCheckbox>
          <VueFileAgent
            v-model="files"
            v-model:raw-model-value="rawFiles"
            :max-files="1"
            max-size="1MB"
            accept="image/jpg,image/jpeg,image/png"
            :multiple="false"
            :error-text="{ type: '檔案格式錯誤', size: '檔案太大' }"
            help-text="選擇檔案或拖放到這裡"
            deletable
            ref="fileAgent"
          ></VueFileAgent>
        </v-card-text>
        <v-card-actions>
          <v-spacer>
            <v-btn color="red" @click="closeDialog">取消</v-btn>
            <v-btn color="green" type="submit" :loading="isSubmitting"
              >送出</v-btn
            >
          </v-spacer>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { apiAuth } from "@/plugins/axios";
import { useSnackbar } from "vuetify-use-dialog";

const createSnackbar = useSnackbar();

// 目前表格設定一頁幾筆
const tableItemsPerPage = ref(5);
// 目前表格設定排序
const tableSortBy = ref([
  {
    key: "name",
    order: "asc",
  },
]);
// 目前表格頁碼
const tablePage = ref(1);
// 表格商品
const tableProducts = ref([]);
// 表格欄位
const tableHeaders = [
  { title: "圖片", align: "center", sortable: false, key: "image" },
  { title: "名稱", align: "center", sortable: true, key: "name" },
  { title: "價格", align: "center", sortable: true, key: "price" },
  { title: "說明", align: "center", sortable: false, key: "description" },
  { title: "分類", align: "center", sortable: true, key: "category" },
  { title: "上架", align: "center", sortable: true, key: "sell" },
  { title: "編輯", align: "center", sortable: false, key: "edit" },
];
// 表格載入狀態
const tableLoading = ref(false);
// 表格總資料數
const tableItemsLength = ref(0);
// 表格搜尋
const tableSearch = ref("");
const tableApplySearch = () => {
  tablePage.value = 1;
  tableLoadItems();
};
// 表格載入資料
const tableLoadItems = async () => {
  tableLoading.value = true;

  try {
    const { data } = await apiAuth.get("/products/all", {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0].key,
        sortOrder: tableSortBy.value[0].order,
        search: tableSearch.value,
      },
    });
    tableProducts.value.splice(
      0,
      tableProducts.value.length,
      ...data.result.data
    );
    tableItemsLength.value = data.result.count;
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

  tableLoading.value = false;
};
tableLoadItems();
// 表格編輯
const tableEditItem = (item) => {
  // 設定表單 id
  dialogId.value = item._id;
  // 表單填入預設值
  name.value.value = item.name;
  price.value.value = item.price;
  description.value.value = item.description;
  category.value.value = item.category;
  sell.value.value = item.sell;
  // 打開表單
  dialog.value = true;
};

// 表單對話框
const dialog = ref(false);
const dialogId = ref("");
const openDialog = () => {
  dialogId.value = "";
  dialog.value = true;
};
const closeDialog = () => {
  dialog.value = false;
  resetForm();
  fileAgent.value.deleteFileRecord();
};

// 表單
const categories = ["衣服", "食品", "3C", "遊戲"];
const schema = yup.object({
  name: yup.string().required("缺少名稱"),
  price: yup
    .number()
    .typeError("缺少價格")
    .required("缺少價格")
    .min(0, "價格錯誤"),
  description: yup.string().required("缺少說明"),
  category: yup
    .string()
    .required("缺少分類")
    .test("isCategory", (value) => categories.includes(value)),
  sell: yup.boolean(),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: "",
    price: 0,
    description: "",
    category: "",
    sell: false,
  },
});
const name = useField("name");
const price = useField("price");
const description = useField("description");
const category = useField("category");
const sell = useField("sell");

const files = ref([]);
const rawFiles = ref([]);
const fileAgent = ref(null);

const submit = handleSubmit(async (values) => {
  if (dialogId.value.length === 0 && files.value.length === 0) return;
  try {
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("price", values.price);
    fd.append("description", values.description);
    fd.append("category", values.category);
    fd.append("sell", values.sell);
    if (files.value.length > 0) fd.append("image", files.value[0].file);

    if (dialogId.value.length > 0) {
      await apiAuth.patch("/products/" + dialogId.value, fd);
    } else {
      await apiAuth.post("/products", fd);
    }
    createSnackbar({
      text: "新增成功",
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "green",
        location: "bottom",
      },
    });
    closeDialog();
    tableLoadItems();
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
