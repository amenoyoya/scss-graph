const axios = require('axios')
const qs = require('querystring')

// RestHeart (MongoDB REST API Server) 接続設定
const mongodbConfig = {
  user: 'admin',
  password: 'secret',
  url: 'http://localhost:8080',
}

// MongoDB ドキュメントオブジェクトファクトリ
const mongodb = async document => {
  await axios.put(mongodbConfig.url + '/' + document, {}, {
    auth: {
      username: mongodbConfig.user,
      password: mongodbConfig.password,
    }
  })
  return {
    // write method
    async set(data) {
      return await axios.post(mongodbConfig.url + '/' + document, data, {
        auth: {
          username: mongodbConfig.user,
          password: mongodbConfig.password,
        }
      })
    },

    // read method
    async get(opt = {}) {
      return await axios.get(mongodbConfig.url + '/' + document + '?' + qs.stringify(opt), {
        auth: {
          username: mongodbConfig.user,
          password: mongodbConfig.password,
        }
      })
    }
  }
}

(async () => {
  // insert data => MongoDB/restheart/myDB
  console.log((await (await mongodb('myDB')).set([
    {a : 1}, {b : 2}, {c : 3}
  ])).data)

  // reat data <= MongoDB/restheart/myDB
  console.log((await (await mongodb('myDB')).get({
    sort: '{"_id": 1}' // _id の昇順で取得
  })).data)
})()