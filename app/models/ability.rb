class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

    can :manage, Project, user_id: user.id
    can [:read, :update], Project, id: user.project_ids
    can [:read, :update, :destroy], User, id: user.id
    can [:read], User
        # projects: { member_ids: [user.id] }
  end
end
