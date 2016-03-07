class Api::V1::ApiController < ActionController::Base
  protect_from_forgery with: :null_session

  rescue_from CanCan::AccessDenied do |exception|
    render json: {message: t('authroization.unauthorized')}, status: :unauthorized
  end

  rescue_from ActiveRecord::RecordNotFound do |exception|
    render json: {message: t('activerecord.exception.not_found')}, status: :not_found
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

  def pagination_dict(object)
    {
      pagination: {
        current_page: object.current_page,
        next_page: object.next_page,
        prev_page: object.prev_page,
        total_pages: object.total_pages,
        total_count: object.total_count
      }
    }
  end

  def jsonapi_params
    params_data = params[:data] || {}
    flatten_params = ActiveSupport::HashWithIndifferentAccess.new
    flatten_params.merge!(params_data[:attributes]) if params_data[:attributes].is_a?(Hash)

    # handle relationships
    relationships_params = params_data[:relationships]
    if relationships_params.is_a?(Hash)
      relationships_params.each do |type, value|
        # if the relationship is something else other than hash (eg. array)
        # the assignment of relationship_id will fail
        relation_model = value[:data][:type].classify.downcase rescue nil
        relationship_id = value[:data][:id] rescue nil
        if relation_model.present? && relationship_id.present?
          flatten_params.merge!({ :"#{relation_model}_id" => relationship_id })
        end
      end
    end

    object_key = params_data[:type].try(:singularize)
    ActionController::Parameters.new(object_key.present? ?
                                       params.merge({ object_key => flatten_params }) : params
    )
  end
end