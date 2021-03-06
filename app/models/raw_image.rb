class RawImage < ActiveRecord::Base
  acts_as_paranoid
  include ::CarrierWave::Backgrounder::Delay unless Rails.env.test?
  mount_uploader :name, RawImageUploader
  process_in_background :name
  validates_processing_of :name

  has_one :mockup, dependent: :destroy
  belongs_to :owner, class_name: 'User', foreign_key: 'user_id'
end
