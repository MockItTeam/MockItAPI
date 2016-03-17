class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

    can :manage, Project, user_id: user.id
    can [:read, :update], Project, id: user.project_ids
    can [:read], Project, invitations: { recipient_id: user.id }

    can [:read], User
    can [:read, :update, :destroy], User, id: user.id

    can :manage, Invitation, project: { user_id: user.id }
    can [:read, :create, :update], Invitation
  end
end