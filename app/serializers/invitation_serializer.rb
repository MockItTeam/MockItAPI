class InvitationSerializer < ActiveModel::Serializer
  attributes :id,
             :status,
             :sender_name,
             :recipient_name,
             :project_name,
             :created_at,
             :updated_at

  belongs_to :project
  belongs_to :sender
  belongs_to :recipient

  def sender_name
    object.sender.username
  end

  def recipient_name
    object.recipient.username
  end

  def project_name
    object.project.name
  end
end
