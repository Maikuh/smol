import { ObjectId } from 'mongodb'
import * as yup from 'yup'

export class Smol {
  _id: ObjectId
  slug: string
  url: string

  constructor (smol: Partial<Smol>) {
    Object.assign(this, smol)
  }

  get id () { return this._id?.toHexString() }
}

export const smolSchema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/^[\w-]+$/i),
  url: yup.string().trim().url().required()
})
