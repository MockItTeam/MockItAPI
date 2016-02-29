ENV['RAILS_ENV'] ||= 'test'
ENV['RACK_ENV'] ||= 'test'

require File.expand_path('../../config/environment', __FILE__)

require 'spec_helper'
require 'rspec/rails'
require 'devise'
require 'json_matchers/rspec'

Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|

  config.use_transactional_fixtures = false

  config.infer_spec_type_from_file_location!

  config.include Devise::TestHelpers, type: :controller
end