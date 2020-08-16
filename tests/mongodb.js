const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');

const DB = {
  host: '127.0.0.1',
  port: '27017',
  user: 'root',
  password: 'root',
  database: 'myDB',
};

(async () => {
  const client = new MongoClient(`mongodb://${DB.user}:${DB.password}@${DB.host}:${DB.port}`, {useUnifiedTopology: true});
  try {
    await client.connect();
    console.log('connected');

    // database接続: 存在しないdatabaseの場合は新規作成される
    const db = client.db(DB.database);
    // collection = table: 存在しない場合は新規作成される
    const collection = db.collection('documents');
    // collection = table にデータ挿入: JSONキーをカラムとしてSchemaが自動的に定義される
    await collection.insertMany(
      [
        {a : 1}, {b : 2}, {c : 3}
      ], (err, result) => {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        console.log(result);
      }
    );
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
})();

// mongo-express確認:
// http://localhost:32776/myDB/documents => ./img/mongodb.png
