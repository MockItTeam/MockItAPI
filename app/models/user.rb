class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable, :trackable

  has_many :raw_images
  has_many :mockups
  has_many :invitations
  has_and_belongs_to_many :projects, dependent: :delete_all

  validates :password,
            presence: {if: :password_required?},
            confirmation: { if: :password_required? },
            numericality: true,
            length: {is: 4}

  validates :username,
            presence: true,
            length: {in: 3..50},
            uniqueness: {case_sensitive: false},
            format: {with: /\A[a-z]+\z/}

  private

  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end
end
