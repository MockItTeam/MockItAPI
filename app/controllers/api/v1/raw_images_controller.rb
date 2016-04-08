class Api::V1::RawImagesController < Api::V1::ApiController

  def show
    image = RawImage.where('name LIKE ?', "%#{params[:name]}%").first!
    send_file image.name.url, type: "image/#{image.name.file.extension.downcase}", disposition: 'inline'
  end
end