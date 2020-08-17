<template>
  <div>
    <h1 class="title">MongoDBを使った読み書き確認</h1>
    <form @submit.prevent="addMessage">
      <b-field label="メッセージ">
        <b-input v-model="message" />
      </b-field>
      <b-field>
        <button type="submit" class="button is-primary">メッセージを追加</button>
      </b-field>
    </form>
    <hr>
    <form @submit.prevent="readMessage">
      <b-field label="取得条件">
        <b-input v-model="readCondition" placeholder='{"sort": "{\"_id\": 1}"}' />
      </b-field>
      <b-field>
        <button type="submit" class="button is-info">メッセージを取得</button>
      </b-field>
      <b-table :data="messages" :columns="columns"></b-table>
    </form>
    <hr>
    <form @submit.prevent="dropMessage">
      <b-field label="削除条件">
        <b-input v-model="dropCondition" placeholder='{"user": {"name": "John Doe"}}' />
      </b-field>
      <b-field>
        <button type="submit" class="button is-danger">メッセージを削除</button>
      </b-field>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      message:'',
      readCondition: '',
      messages: [],
      columns: [
        {field: 'id', label: 'ID'},
        {field: 'message', label: 'Message'},
        {field: 'user_name', label: 'UserName'},
      ],
      dropCondition: '',
    };
  },
  mounted() {
    // MongoDB REST API Server 接続
    this.$initializeMongoDB({
      user: 'admin',
      password: 'secret',
      url: 'http://localhost:8080',
    })
  },
  methods: {
    /**
     * メッセージ追加
     */
    async addMessage() {
      const res = await this.$mongodb().ref('slack')
        .push({
          content: this.message,
          user: {
            name: 'John Doe'
          }
        })
      this.$buefy.snackbar.open('メッセージが追加されました')
    },

    /**
     * メッセージ取得
     */
    async readMessage() {
      const res = await this.$mongodb().ref('slack')
        .get(this.readCondition? JSON.parse(this.readCondition): {})
      this.messages = []
      for (const data of res.data) {
        this.messages.push({
          'id': data['_id']['$oid'],
          'message': data.content,
          'user_name': data.user.name,
        })
      }
    },

    /**
     * メッセージ削除
     */
    async dropMessage() {
      const res = this.dropCondition?
        await this.$mongodb().ref('slack').drop(JSON.parse(this.dropCondition))
        : await this.$mongodb().ref('slack').dropAll()
      this.$buefy.snackbar.open('メッセージを削除しました')
    }
  },
};
</script>