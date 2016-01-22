class Mockup < ActiveRecord::Base
  enum status: { active: 0 }

  belongs_to :raw_image
  belongs_to :user
  belongs_to :project

  validates :name, length: { in: 0..100 }
  validates :name, format: { with: /\A[a-zA-Z0-9\s]+\z/,
                             message: "Only a-z, A-Z, 0-9 and white-space allowed" }
end
