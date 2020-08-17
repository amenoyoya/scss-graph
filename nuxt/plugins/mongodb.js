/**
 * MongoDB REST API Server (RestHeart) wrapper
 */
import Vue from 'vue'
import axios from 'axios'
import qs from 'querystring'

/**
 * DataController class
 * @method push: (data: object) => result: axios.Response
 * @method get: (opt: object|string) => result: axios.Response
 * @method set: (data: object, opt: object|string) => result: axios.Response
 * @method drop: (opt)
 */
class DataController {
  /**
   * new DataController
   * @param {*} config 
   * @param {string} collection
   */
  constructor(config, collection) {
    this.config = config
    this.collection = collection
  }

  /**
   * データ挿入
   * @param {*} data 複数データOK
   * @return {axios.Response}
   */
  async push(data) {
    return await axios.post(this.config.url + '/' + this.collection, data, {
      auth: {
        username: this.config.user,
        password: this.config.password,
      }
    })
  }

  /**
   * データ取得
   * @param {*} opt 検索条件 | 文字列（_id）を指定した場合はそのデータのみ取得
   * @return {axios.Response}
   */
  async get(opt = {}) {
    if (typeof opt === 'object') {
      return await axios.get(this.config.url + '/' + this.collection + '?' + qs.stringify(opt), {
        auth: {
          username: this.config.user,
          password: this.config.password,
        }
      })
    }
    return await axios.get(this.config.url + '/' + this.collection + '/' + opt, {
      auth: {
        username: this.config.user,
        password: this.config.password,
      }
    })
  }

  /**
   * データ更新
   * @param {*} data 指定されたキーのみ値を更新する
   * @param {*} opt 更新対象データ絞り込み条件 | 文字列（_id）を指定した場合はそのデータのみ更新
   * @return {axios.Response}
   */
  async set(data, opt) {
    if (typeof opt === 'object') {
      return await axios.patch(this.config.url + '/' + this.collection + '/*?filter=' + JSON.stringify(opt), data, {
        auth: {
          username: this.config.user,
          password: this.config.password,
        }
      })
    }
    return await axios.patch(this.config.url + '/' + this.collection + '/' + opt, data, {
      auth: {
        username: this.config.user,
        password: this.config.password,
      }
    })
  }

  /**
   * 全データ更新
   * @param {*} data 指定されたキーのみ値を更新する
   * @return {[axios.Response]}
   */
  async setAll(data) {
    const results = []
    for (const row of (await this.get()).data) {
      results.push(await this.set(data, row['_id']['$oid']))
    }
    return results
  }

  /**
   * データ削除
   * @param {*} opt 削除対象データ絞り込み条件 | 文字列（_id）を指定した場合はそのデータのみ削除
   * @return {axios.Response}
   */
  async drop(opt) {
    if (typeof opt === 'object') {
      return await axios.delete(this.config.url + '/' + this.collection + '/*?filter=' + JSON.stringify(opt), {
        auth: {
          username: this.config.user,
          password: this.config.password,
        }
      })
    }
    return await axios.delete(this.config.url + '/' + this.collection + '/' + opt, {
      auth: {
        username: this.config.user,
        password: this.config.password,
      }
    })
  }

  /**
   * 全データ削除
   * @return {[axios.Response]}
   */
  async dropAll() {
    const results = []
    for (const row of (await this.get()).data) {
      results.push(await this.drop(row['_id']['$oid']))
    }
    return results
  }
}

/**
 * RestHeart class
 */
class RestHeart {
  /**
   * new RestHeart
   * @param {*} config 
   */
  constructor(config = {}) {
    this.config = {
      user: config.user? config.user: 'admin',
      password: config.password? config.password: 'secret',
      url: 'http://localhost:8080',
    }
  }

  /**
   * DataController factory
   * @param {string} collection
   * @return {DataController}
   */
  ref(collection) {
    return new DataController(this.config, collection)
  }
}

/**
 * Vue plugin: new RestHeart
 * @param {*} config 
 */
Vue.prototype.$initializeMongoDB = (config = {}) => {
  const restheart = new RestHeart(config)
  /**
   * Vue plugin: get RestHeart object
   * @return {RestHeart}
   */
  Vue.prototype.$mongodb = () => {
    return restheart
  }
}