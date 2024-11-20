import { AbilityBuilder, PureAbility } from '@casl/ability'

export type Subjects = 'acl-page' | 'all' | string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = PureAbility<[Actions, Subjects]>

export const AppAbility = PureAbility as new (...args: any[]) => AppAbility

export type ACLObj = {
  action: Actions
  subject: Subjects
}

/**
 * Define Ability rules based on user roles and subjects.
 */
const defineRulesFor = (role: string, subject: Subjects) => {
  const { can, rules } = new AbilityBuilder<AppAbility>(AppAbility)

  if (role.toLowerCase() === 'admin') {
    can('manage', 'all') // Admin can manage everything
  } else if (role.toLowerCase() === 'student') {
    can('read', 'acl-page') // Students can only read the ACL page
  } else {
    can(['read', 'create', 'update', 'delete'], subject) // Default permissions for others
  }

  return rules
}

export const buildAbilityFor = (role: string, subject: Subjects): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    // Handle object type detection safely
    detectSubjectType: (object: { type?: string; constructor?: { name: string } }) => {
      if (object.type) {
        return object.type
      } else if (object.constructor && object.constructor.name) {
        return object.constructor.name
      }
      throw new Error('Unable to detect subject type') // Handle edge cases
    },
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all',
}

export default defineRulesFor
