class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  rescue_from CanCan::AccessDenied do |exception|
    render file: 'public/401', layout: false, status: :unauthorized
  end

  rescue_from ActiveRecord::RecordNotFound do |exception|
    render file: 'public/404', layout: false, status: :not_found
  end

  # Ember mounted app
  # Required to be defined here as of ember-cli-rails v0.5.6
  def frontend
    render 'frontend/index', layout: false
  end
end
