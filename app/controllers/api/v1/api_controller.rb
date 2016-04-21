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

  def jsonapi_params
    params_data = params[:data] || {}
    flatten_params = ActiveSupport::HashWithIndifferentAccess.new
    flatten_params.merge!(params_data[:attributes]) if params_data[:attributes].is_a?(Hash)

    # handle relationships
    relationships_params = params_data[:relationships]
    if relationships_params.is_a?(Hash)
      relationships_params.each do |type, value|
        relation_key = type.classify.downcase rescue nil
        if value[:data].is_a?(Array)
          tmp_array = []
          value[:data].each do |hash_data|
            relation_model = hash_data[:type].classify.downcase rescue nil
            relationship_id = hash_data[:id] rescue nil
            if relation_model.present? && relationship_id.present?
              tmp_array << relationship_id.to_i
            end
          end
          flatten_params.merge!({:"#{relation_key}_ids" => tmp_array})
        else
          relation_model = value[:data][:type].classify.downcase rescue nil
          relationship_id = value[:data][:id] rescue nil
          if relation_model.present? && relationship_id.present?
            flatten_params.merge!({:"#{type.classify.downcase rescue nil}_id" => relationship_id.to_i})
          end
        end
      end
    end

    object_key = params_data[:type].try(:singularize)
    ActionController::Parameters.new(object_key.present? ?
                                       params.merge({object_key => flatten_params}) : params
    )
  end
end