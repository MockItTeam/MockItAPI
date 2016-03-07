class InvitationSerializer < ActiveModel::Serializer
  attributes :id,
             :status,
             :created_at,
             :updated_at

  belongs_to :project
  belongs_to :sender
  belongs_to :recipient
end
