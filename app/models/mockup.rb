class Mockup < ActiveRecord::Base
  belongs_to :raw_image
  belongs_to :user
  belongs_to :project

  validates :description, length: { in: 0..100 }
  validates :description, format: { with: /\A[a-zA-Z0-9\s]+\z/,
                             message: "Only a-z, A-Z, 0-9 and white-space allowed" }
end
