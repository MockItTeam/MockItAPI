class Api::V1::RawImagesController < Api::V1::ApiController
  before_action :authenticate_user!
  before_action :page_params

  load_and_authorize_resource

  def index
    respond_to do |format|
      format.json { render json: @raw_images, status: :ok}
    end
  end

  def show
    respond_to do |format|
      format.json { render json: @raw_image, status: :ok }
    end
  end

  def create
    @image = RawImage.new(create_image_params)
    respond_to do |format|
      if @image.save
        format.json { render json: @image, status: :created }
      else
        format.json { render json: {errors: [@image.errors.full_messages.to_sentence]}, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @raw_image.update_attributes(update_image_params)
        format.json { render json: @raw_image, status: :ok }
      else
        format.json { render json: { errors: [ @raw_image.errors.full_messages.to_sentence ] }, status: :unprocessable_entity }
      end
    end
  end

  private

  def update_image_params
    params.require(:image).permit(:name, :status)
  end

  def create_image_params
    params.require(:image).permit(:name).merge(user: current_user)
  end
end