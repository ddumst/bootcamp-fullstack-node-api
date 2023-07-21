import { AccessControl } from 'role-acl';
import { grantList } from './grant-list';

export default function ac(role: string, action: string, resource: string) {
  const ac = new AccessControl(grantList);
  return ac.can(role).execute(action).sync().on(resource);
}