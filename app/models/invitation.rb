class Invitation < ActiveRecord::Base
  enum status: { pending: 0, accepted: 1, refused: 2, cancelled: 3 }

  belongs_to :from, class_name: "User", foreign_key: "from_user_id"
  belongs_to :to, class_name: "User", foreign_key: "to_user_id"
  belongs_to :project

  validates_presence_of :from, :to, :project
end
