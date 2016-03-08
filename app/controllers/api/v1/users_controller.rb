class Api::V1::UsersController < Api::V1::ApiController
  before_action :authenticate_user!
  before_action :page_params

  skip_load_and_authorize_resource only: [:show]

  def show
    if params[:id] == 'me'
      @user = current_user
      authorize! :show, @user
    else
      @user = User.find(params[:id])
      authorize! :show, @user
    end
    render json: @user, status: :ok
  end
end