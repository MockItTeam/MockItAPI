class Mockup < ActiveRecord::Base
  acts_as_paranoid
  enum status: %w(pending in_progress created error)

  belongs_to :raw_image
  belongs_to :owner, class_name: 'User', foreign_key: 'user_id'
  belongs_to :project

  validates_presence_of :project, :owner
  validate :json_format, on: :update, unless: :raw_image?
  validate :status_created?, on: :update

  validates :name,
            length: {in: 0..20},
            format: {with: /\A[a-zA-Z0-9\s]+\z/}
  validates_uniqueness_of :name, scope: :project

  before_validation :set_default_name
  before_create :set_default_status
  after_create :image_processing, if: :raw_image?

  scope :recently, -> { order(updated_at: :desc) }

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

  def set_default_name
    unless self.name
      i = 1
      begin
        self.name = "Untitled #{i}"
        i += 1
      end while (self.class.exists?(name: self.name))
    end
  end

  def status_created?
    errors.add(:base, 'Cannot update, because this mockup is not created or still in progress.') unless self.status == 'created'
  end

  def raw_image?
    self.raw_image.present?
  end

  def json_format
    errors.add(:json_elements, 'is not in json format') unless json_elements.is_json?
  end

  def image_processing
    self.status = :in_progress
    save!(validate: false)

    begin
      result = %x(python ~/ElementDetector/main.py -f "#{self.raw_image.name.url}")
      result = JSON.parse(result)
    rescue Exception => e
      self.error_message = e.to_s
      self.status = :error
    end

    if result.error_message
      self.error_message = result["error_message"].to_json
      self.status = :error
    else
      self.json_elements = result["json_elements"].to_json
      self.status = :created
    end

    save!(validate: false)
  end

  handle_asynchronously :image_processing, :priority => 1, :run_at => Proc.new { 1.seconds.from_now }
end
