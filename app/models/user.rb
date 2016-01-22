class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :trackable

  enum status: { active: 0 }

  has_many :raw_images
  has_many :mockups
  has_many :invitations
  has_and_belongs_to_many :projects

  validates_presence_of :username, :password

  validates :password, numericality: true, length: { is: 4 }
  validates :username, length: { in: 3..20 } ,
                       uniqueness: { case_sensitive: false },
                       format: { with: /\A[a-z]+\z/,
                                 message: "Only a-z (lowercase) allowed" }
end
