class Api::V1::MockupsController < Api::V1::ApiController
  before_action :authenticate_user!

  load_resource except: [:index, :create]
  authorize_resource

  def index
    @mockups = Mockup
                 .accessible_by(current_ability)

    render json: @mockups, include: %w(raw_image), status: :ok
  end

  def show
    render json: @mockup, include: %w(raw_image), status: :ok
  end

  def create
    @mockup = Mockup.new(create_mockup_params)
    # case create mockup by image
    @mockup.attach_raw_image(jsonapi_params[:mockup][:raw_image], current_user) if jsonapi_params[:mockup][:raw_image]

    if @mockup.save
      render json: @mockup, status: :created
    else
      render json: {errors: [@mockup.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  def update
    if @mockup.update_attributes(update_mockup_params)
      render json: @mockup, status: :ok
    else
      render json: {errors: [@mockup.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  def destroy
    if @mockup.destroy
      head :no_content
    else
      render json: {errors: [@mockup.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  private

  def create_mockup_params
    jsonapi_params.require(:mockup).permit(:project_id, :name, :json_elements).merge(owner: current_user)
  end

  def update_mockup_params
    jsonapi_params.require(:mockup).permit(:name, :json_elements)
  end
end