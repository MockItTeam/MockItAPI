class Mockup < ActiveRecord::Base
  acts_as_paranoid
  enum status: %w(pending in_progress created error)

  belongs_to :raw_image
  belongs_to :owner, class_name: 'User', foreign_key: 'user_id'
  belongs_to :project

  validates_presence_of :project, :owner
  validates_presence_of :json_elements, unless: :raw_image?
  validate :json_format, unless: :raw_image?

  validates :description,
            length: {in: 0..100},
            format: {with: /\A[a-zA-Z0-9\s]+\z/}

  before_create :set_default_status
  after_create :image_processing, :change_status, if: :raw_image?

  def attach_raw_image(raw_image, owner)
    self.raw_image = RawImage.new(name: raw_image, owner: owner)
  end

  private

  def set_default_status
    if raw_image?
      self.status = :pending
    else
      self.status = :created
    end
  end

  def raw_image?
    self.raw_image.present?
  end

  def json_format
    errors.add(:json_elements, 'is not in json format') unless json_elements.is_json?
  end

  def change_status
    self.status = 'in_progress'
    save!
  end

  handle_asynchronously :change_status, :run_at => Proc.new { 10.seconds.from_now }

  def image_processing

    result = %x(python ~/ElementDetector/main.py -f #{self.raw_image.name.url})
    unless result.nil?
      self.json_elements = result
      self.status = 'created'
    else
      self.status = 'error'
    end

    save!
  end

  handle_asynchronously :image_processing, :priority => 1, :run_at => Proc.new { 20.seconds.from_now }
end
