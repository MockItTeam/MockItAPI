class Api::V1::RawImagesController < Api::V1::ApiController
  before_action :authenticate_user!

  def create
    @image = RawImage.new(image_params)
    respond_to do |format|
      if @image.save
        format.json { render json: @image, status: :created }
      else
        format.json { render json: { errors: [ @image.errors.full_messages.to_sentence ] }, status: :unprocessable_entity }
      end
    end
  end
  private

  def image_params
    params.require(:image).permit(:name).merge(user: current_user)
  end
end