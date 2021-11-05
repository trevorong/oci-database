const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: process.env.HOME + '/Downloads/instantclient_19_8' });

async function run() {

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "", password: "", connectionString: "" });

    const soda = await connection.getSodaDatabase();
    const collection = await soda.openCollection('test');

    // get count of docs in 'test'
    const count = await collection.find().count();
    console.log(count)

    try {
      const content = { name : "bob" };
      await collection.insertOne(content);
      // console.log(newDoc.key);
      // const newContent = await newDoc.getContent();
      // console.log(newContent);
    } catch (err) {
      console.error(err);
    }

     // get all docs from 'test' and parse json content from docs
     const data = await collection.find().getDocuments();
     const docs = await Promise.all(data.map(doc => doc.getContent()));
     console.log(docs);

     connection.commit();     // uncomment to make data persistent

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();
