<template>
  <el-popconfirm
    popper-class="write-us-popconfirm"
    :confirmButtonText="$t('write-us.confirm')"
    :cancelButtonText="$t('write-us.reject')"
    icon="el-icon-info"
    iconColor="#49ab1a"
    @onConfirm="onConfirm"
    @onCancel="onCancel"
    :title="
      `${$t('write-us.answer')} ${$t(
        'write-us.confirmed-rejected-count',
        confirmedRejectedCount
      )}`
    "
  >
    <el-button icon="fas fa-edit" type="primary" slot="reference">
      {{ $t("write-us.title") }}</el-button
    >
  </el-popconfirm>
</template>

<script>
export default {
  methods: {
    onConfirm() {
      this.$store.commit("addWriteUsConfirm");
    },
    onCancel() {
      this.$store.commit("addWriteUsCancel");
    }
  },
  computed: {
    confirmedRejectedCount() {
      return this.$store.state.uiState.writeUs;
    }
  }
};
</script>
<style lang="scss">
.write-us-popconfirm {
  width: 330px;
  word-break: break-word !important;
}
</style>
