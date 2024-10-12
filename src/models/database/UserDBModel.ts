import { ObjectId } from "mongodb";

export class UserDBModel {
  constructor(
    public _id: ObjectId,
    public accountData: {
      userName: string
      passwordHash: string
      email: string
      createdAt: string
      isMembership: boolean
    },
    public emailConfirmation: {
      confirmationCode: string | null
      expirationDate: Date | null
      isConfirmed: boolean
    },
  ) {}
}