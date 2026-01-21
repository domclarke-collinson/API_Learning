import { Membership } from "../membership.entity";


export class CreateMembershipModel {
  email: string;

  constructor(email: string) {
    this.email = email;
  }

  toJSON() {
    return {
      email: this.email,
    };
  }

  static fromJSON(json: any) {
    return new CreateMembershipModel(json.email);
  }

  static fromEntity(entity: Membership) {
    return new CreateMembershipModel(entity.email);
  }
}