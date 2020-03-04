<template>
  <el-dropdown trigger="click" @command="onChangeLocale">
    <el-button type="text"
      >{{ currentLocale }}<i class="el-icon-arrow-down el-icon--right"></i
    ></el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="locale of locales"
        :key="`locale-${locale.key}`"
        :command="locale.key"
      >
        {{ locale.name }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      locales: [
        { key: "ru", name: "Русский" },
        { key: "uz", name: "O'zbek" }
      ]
    };
  },
  methods: {
    onChangeLocale(key) {
      this.$i18n.locale = key;
      this.$store.commit("setLocale", key);
    }
  },
  computed: {
    currentLocale() {
      let { locale } = this.$i18n;
      let item = this.locales.find(x => x.key === locale);
      return item ? item.name : "Русский";
    }
  }
};
</script>

<style scoped>
/deep/ .el-button--text:hover,
.el-button--text:focus {
  color: #eaeaea;
  text-decoration: underline;
}
/deep/ .el-button--text {
  color: #fff;
  text-decoration: underline;
}
</style>
