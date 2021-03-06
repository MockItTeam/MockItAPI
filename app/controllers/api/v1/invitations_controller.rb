class Api::V1::InvitationsController < Api::V1::ApiController
  before_action :authenticate_user!

  load_resource expect: [:index, :create]
  authorize_resource

  def index
    filters = {}

    unless params[:condition].blank?
      filters[:user_id] = current_user.id if params[:condition] == 'recipient'
    end

    filters[:status] = params[:status] unless params[:status].blank?

    @invitations = Invitation
                     .accessible_by(current_ability)
                     .search(filters)


    render json: @invitations, status: :ok
  end

  def show
    render json: @invitation, include: %w(sender recipient), status: :ok
  end

  def create
    @invitation = Invitation.new(create_invitation_params)
    @invitation.sender = current_user

    if @invitation.save
      render json: @invitation, status: :created
    else
      render json: {errors: [@invitation.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  def update
    if @invitation.can_change_status(current_user.id) && @invitation.update_attributes(update_invitation_params)
      render json: @invitation, status: :ok
    else
      render json: {errors: [@invitation.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  def destroy
    if @invitation.destroy
      head :no_content
    else
      render json: {errors: [@invitation.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  private

  def create_invitation_params
    jsonapi_params.require(:invitation).permit(:recipient_id, :project_id)
  end

  def update_invitation_params
    jsonapi_params.require(:invitation).permit(:status)
  end
end