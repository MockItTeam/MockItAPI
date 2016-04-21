class Api::V1::RawImagesController < Api::V1::ApiController

  def show
    image = RawImage.find(params[:id])
    render json: image, status: :ok
  end

  def get_image
    image = RawImage.where('name LIKE ?', "%#{params[:name]}%").first!
    send_file image.name.medium.url, type: "image/#{image.name.file.extension.downcase}", disposition: 'inline'
  end
end