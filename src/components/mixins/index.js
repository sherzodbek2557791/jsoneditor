import axios from "axios";
import enums from "../../util/enums";
import uuid from "../../plugin/uuid";

export default {
  enumMixin: {
    data: () => enums
  },
  uploadMixin: {
    data() {
      return {
        get clientId() {
          return "jsoneditor-ui";
        },
        get fileUploadUrl() {
          return "http://file.kvikk.uz/file-server/uploadFile";
        },
        get fileDownloadUrl() {
          return "http://file.kvikk.uz/file-server/downloadFile";
        }
      };
    },
    methods: {
      jsonUpload(url, jsonObject) {
        let file = new Blob([JSON.stringify(jsonObject)], {
          type: "application/json"
        });
        let formData = new FormData();
        formData.append("clientId", this.clientId);
        formData.append("fileResourceType", this.FileResourceType.JSON_DATA);
        formData.append("file", file, `${uuid()}.json`);
        return axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      },
      jsonDownload(url) {
        return axios({
          url,
          method: "GET",
          responseType: "blob" // important
        });
      }
    }
  }
};
