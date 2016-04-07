class Api::V1::UsersController < Api::V1::ApiController
  before_action :authenticate_user!

  load_and_authorize_resource
  skip_load_and_authorize_resource only: [:show]

  def index
    @users = @users.where(username: params[:username])
    render json: @users, status: :ok
  end

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