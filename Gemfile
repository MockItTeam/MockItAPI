source 'https://rubygems.org'

ruby '2.3.0'

# Backend
gem 'rails', '4.2.5' # Latest stable
gem 'pg' # Use Postgresql as database
gem 'active_model_serializers', '~> 0.10.0.rc4' # ActiveModel::Serializer implementation and Rails hooks
gem 'carrierwave' # Classier solution for file uploads for Rails
gem 'carrierwave-aws'
gem 'mini_magick' # A ruby wrapper for ImageMagick or GraphicsMagick command line
gem 'chronic' # Chronic is a pure Ruby natural language date parser.
gem 'paranoia', '~> 2.1.3' # Paranoia is a re-implementation of acts_as_paranoid for Rails 3 and Rails 4. Soft-deletion of records
gem 'ffaker' # A library for generating fake data such as names, addresses, and phone numbers.
gem 'factory_girl_rails'

# Authentications & Authorizations
gem 'devise' # Authentication solution for Rails with Warden
gem 'doorkeeper' # OAuth 2 provider
gem 'cancancan', '~> 1.10' # Continuation of CanCan, the authorization Gem for Ruby on Rails.

# Deploy
gem 'mina'
gem 'mina-puma', :require => false
gem 'puma', '~> 3.1.0'

# Assets
gem 'ember-cli-rails' # Integrate Ember CLI with rails
gem 'jquery-rails' # Use jquery as the JavaScript library
gem 'sass-rails' # SASS
gem 'bootstrap', '~> 4.0.0.alpha3'
gem 'font-awesome-sass'

# Delay job
gem 'delayed_job_active_record'
gem 'carrierwave_backgrounder'

source 'https://rails-assets.org' do
  gem 'rails-assets-underscore'     # Adds Underscore JS to the Rails asset pipeline
  gem 'rails-assets-jquery.cookie'  # Adds jquery-cookie to the Rails asset pipeline
  gem 'rails-assets-animate-sass'   # Animate.sass for the Rails assets pipeline
  gem 'rails-assets-tether'
end

group :development do
  gem 'better_errors' # Better error page for Rails and other Rack apps
  gem 'binding_of_caller' # Retrieve the binding of a method's caller in MRI 1.9.2+
  gem 'quiet_assets' # For cleaner logs
  gem 'awesome_print' # Pretty print your Ruby objects with style -- in full color and with proper indentation
end

group :development, :test do
  gem 'figaro' # Simple Rails app configuration

  gem 'rspec-rails' # Rails testing engine
  gem 'rspec-retry' # Retry randomly failing rspec example.
  gem 'shoulda-matchers' # Tests common Rails functionalities
  gem 'database_cleaner' # Use Database Cleaner
  gem 'json_matchers' # Tests common Rails functionalities
  gem 'capybara' # Integration testing
  gem 'poltergeist' # Headless browser

  gem 'byebug' # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'spring' # Spring speeds up development by keeping your application running in the background.
end

group :production do
  gem 'uglifier'
  gem 'rails_12factor' # Makes running your Rails app easier. Based on the ideas behind 12factor.net (Heroku)
  gem 'rack-timeout' # Rack middleware which aborts requests that have been running for longer than a specified timeout.
end
