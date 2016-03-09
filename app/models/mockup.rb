class Mockup < ActiveRecord::Base
  acts_as_paranoid

  belongs_to :raw_image, dependent: :destroy
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
  belongs_to :project

  validates :description, length: {in: 0..100}
  validates :description, format: {with: /\A[a-zA-Z0-9\s]+\z/}
end
