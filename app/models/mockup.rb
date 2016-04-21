class Mockup < ActiveRecord::Base
  acts_as_paranoid
  enum status: %w(pending in_progress created error)

  belongs_to :raw_image
  belongs_to :owner, class_name: 'User', foreign_key: 'user_id'
  belongs_to :project

  validates_presence_of :project, :owner
  validate :json_format, on: :update, unless: :raw_image?
  validate :status_created_or_error?, on: :update

  validates :name,
            length: {in: 4..20},
            format: {with: /\A[a-zA-Z0-9\s]+\z/}
  validates_uniqueness_of :name, scope: :project

  before_validation :set_default_name
  after_create :before_process_image
  before_update :before_process_image, if: Proc.new { |mockup| mockup.status == 'error' }

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

  def status_created_or_error?
    errors.add(:base, 'Cannot update, because this mockup is not created or still in progress.') unless self.status == 'created' || self.status == 'error'
  end

  def raw_image?
    self.raw_image.present?
  end

  def json_format
    errors.add(:json_elements, 'is not in json format') unless json_elements.is_json?
  end

  def before_process_image
    if raw_image?
      update_columns(status: Mockup.statuses[:in_progress])
      process_image
    else
      update_columns(status: Mockup.statuses[:created])
      default_border_mockup
    end
  end

  def default_border_mockup
    update_columns(json_elements: %q({"width": 800, "height": 600, "elements": [] }))
  end

  def process_image
    begin
      command = "python ~/ElementDetector/main.py -o True -f \"#{self.raw_image.name.url}\""
      result = %x(python ~/ElementDetector/main.py -o True -f "#{self.raw_image.name.url}")

      message = {}

      if result == nil
        message["exec_command"] = command
        message["reason"] = "output from processor is nil (#{result})"
        update_columns(status: Mockup.statuses[:error], error_message: message.to_json)
      else
        result_hash = JSON.parse(result)
        if result_hash["error_message"]
          update_columns(status: Mockup.statuses[:error], error_message: result_hash["error_message"].to_json)
        elsif result_hash["json_elements"]
          update_columns(status: Mockup.statuses[:created], json_elements: result_hash["json_elements"].to_json)
        else
          message["exec_command"] = command
          message["output_from_processor"] = result
          update_columns(status: Mockup.statuses[:error], error_message: message.to_json)
        end
      end

    rescue Exception => e
      message = {}
      message["exec_command"] = command
      message["output_from_processor"] = result
      message["rails_exception"] = e.backtrace.to_s
      update_columns(status: Mockup.statuses[:error], error_message: message.to_json)
    end
  end

  handle_asynchronously :process_image, :run_at => Proc.new { 1.seconds.from_now }
end
