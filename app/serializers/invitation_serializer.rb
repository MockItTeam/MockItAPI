class InvitationSerializer < ActiveModel::Serializer
  attributes :id,
             :status,
             :sender_id,
             :recipient_id,
             :project_id,
             :created_at,
             :updated_at

  belongs_to :project
  belongs_to :sender
  belongs_to :recipient
end
