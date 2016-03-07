class Project < ActiveRecord::Base
  acts_as_paranoid
  mount_uploader :image, ImageUploader

  has_many :invitations, dependent: :destroy
  has_many :mockups, dependent: :destroy
  has_and_belongs_to_many :members, class_name: 'User', dependent: :delete_all
  belongs_to :owner, class_name: 'User', foreign_key: 'user_id'

  validates_presence_of :owner
  validates_uniqueness_of :name
  validates :name,
            presence: true,
            length: { in: 3..20 },
            format: { with: /\A[a-zA-Z0-9]+\z/ }

  scope :pending_invitations, -> () { project.invitations.where(status: :pending) }
end
