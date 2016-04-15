class Mockup < ActiveRecord::Base
  acts_as_paranoid
  enum status: %w(pending in_progress created error)

  belongs_to :raw_image, dependent: :destroy
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
  after_create :image_processing

  scope :recently, -> { order(updated_at: :desc) }

  def attach_raw_image(raw_image, owner)
    self.raw_image = RawImage.new(name: raw_image, owner: owner)
  end

  private

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
    if self.raw_image.present?
      self.status = :in_progress
      self.save(validate: false)
    else
      self.status = :created
      self.save(validate: false)
      return
    end

    begin
      command = "python ~/ElementDetector/main.py -f \"#{self.raw_image.name.url}\""
      result = %x(python ~/ElementDetector/main.py -f "#{self.raw_image.name.url}")
      if result == nil
        message = {}
        message["exec_command"] = command
        message["reason"] = "output from processor is nil (#{result})"
        self.error_message = message.to_json
        self.status = :error
      else
        result_hash = JSON.parse(result)
        if result_hash["error_message"]
          self.error_message = result_hash["error_message"].to_json
          self.status = :error
        elsif result_hash["json_elements"]
          self.json_elements = result_hash["json_elements"].to_json
          self.status = :created
        else
          message = {}
          message["exec_command"] = command
          message["output_from_processor"] = result
          self.error_message = message.to_json
          self.status = :error
        end
      end
    rescue Exception => e
      message = {}
      message["exec_command"] = command
      message["output_from_processor"] = result
      message["rails_exception"] = e.backtrace.to_s
      self.error_message = message.to_json
      self.status = :error
    end

    self.save(validate: false)
  end

  handle_asynchronously :image_processing, :run_at => Proc.new { 1.seconds.from_now }
end
