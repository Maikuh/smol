import { Collection, Db, MongoClient, Document } from 'mongodb'
import { Smol } from '../models/smol.model'

export let db: Db
export let smols: Collection<Smol & Document>

export async function initDatabase () {
  const client = new MongoClient(
    process.env.MONGO_URI || 'mongodb://localhost/smol'
  )

  await client.connect()

  console.log('Successfully connected to the database')

  db = client.db()
  smols = db.collection('smols')

  // Indexes
  await smols.createIndex({ slug: 1 }, { unique: true })
  await smols.createIndex({ url: 1 }, { unique: true })
}
