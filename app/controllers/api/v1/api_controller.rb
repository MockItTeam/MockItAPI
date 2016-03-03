class Api::V1::ApiController < ActionController::Base
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.json { render json: { message: exception.message }, status: :unauthorized  }
    end
  end

  def current_user
    return unless doorkeeper_token
    @current_user ||= User.where(id: doorkeeper_token.resource_owner_id).first
  end

  def authenticate_user!
    head :unauthorized unless current_user
  end

  def page_params
    @page = params[:page] || 1
    @per_page = params[:per_page] || 25
  end
end