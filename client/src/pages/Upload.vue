<template>
  <div class="container">
    <div class="column">
      <datepicker v-model="datepicked"
      :minimumView="'month'" :maximumView="'month'"
      :inline="true" />
      <div class="input-box">
        <input type="file" class="inputfile" id="file" ref="file" v-on:change="handleFileUpload()"/>
        <label for="file">{{inputLabel}}</label>
        <button class="subbut" :disabled="datepicked=='' ||
         file==''" v-on:click="submitFile()">Submit</button>
      </div>
      <p>
        <span v-if="status==1">Success!</span>
        <span v-if="status==2">
          Something went wrong.
          Either CSV is badly formatted or month already exists
        </span>
        <span v-if="status==3">Processing...</span>
      </p>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';

export default {
  components: { Datepicker },
  /*
      Defines the data used by the component
    */
  data() {
    return {
      status: 0,
      file: '',
      datepicked: '',
    };
  },
  computed: {
    inputLabel() {
      if (this.file === '') return 'Choose a file';
      return 'CSV Selected';
    },
    year() {
      return moment(this.datepicked).format('YYYY');
    },
    month() {
      return moment(this.datepicked).format('M');
    },
  },
  methods: {
    /*
        Submits the file to the server
      */
    submitFile() {
      const that = this;
      that.status = 3;
      const formData = new FormData();
      formData.append('recfile', this.file);
      if ((this.$router.currentRoute.path).match('AppService')) {
        this.$http
          .post('/api/AppService/upload/' + this.year + '/' + this.month, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(that.status = 1)
          .catch(that.status = 2);
      } else if ((this.$router.currentRoute.path).match('DEV')) {
        this.$http
          .post('/api/DEV/upload/' + this.year + '/' + this.month, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(that.status = 1)
          .catch(that.status = 2);
      }
    },

    /*
        Handles a change on the file upload
    */
    handleFileUpload() {
      this.file = this.$refs.file.files[0]
    },
  },
};
</script>

<style>
@import"test.css";
</style>
