class Api::V1::InvitationsController < Api::V1::ApiController
  before_action :authenticate_user!
  before_action :page_params

  load_resource expect: [:index, :create]
  authorize_resource

  def index
    filters = {}
    filters[:user_id] = params[:user_id] unless params[:user_id].blank?
    filters[:status] = params[:status] unless params[:status].blank?

    @invitations = Invitation
                     .accessible_by(current_ability)
                     .search(filters)
                     .page(@page)
                     .per(@per_page)


    render json: @invitations,
           meta: pagination_dict(@invitations),
           status: :ok
  end

  def show
    render json: @invitation, status: :ok
  end

  def create
    @invitation = Invitation.new(invitation_params)

    if @invitation.check_invitation(current_user.id) && @invitation.save
      render json: @invitation, status: :created
    else
      render json: {errors: [@invitation.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  def update
    if @invitation.update_attributes(update_invitation_params)
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

  def invitation_params
    jsonapi_params.require(:invitation).permit(:sender_id, :recipient_id, :project_id)
  end

  def update_invitation_params
    jsonapi_params.require(:invitation).permit(:status)
  end
end