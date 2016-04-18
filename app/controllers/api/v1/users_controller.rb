class Api::V1::UsersController < Api::V1::ApiController
  before_action :authenticate_user!

  load_resource except: [:index]
  authorize_resource
  skip_load_and_authorize_resource only: [:show]

  def index
    filters = {}
    filters[:username] = params[:username] unless params[:username].blank?

    @users = User
               .accessible_by(current_ability)
               .search(filters)

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