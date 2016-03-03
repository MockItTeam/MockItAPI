class Api::V1::ProjectsController < Api::V1::ApiController
  before_action :authenticate_user!
  before_action :page_params

  load_and_authorize_resource
  skip_load_resource only: :create

  def index
    render json: @projects, status: :ok
  end

  def show
    render json: @project, status: :ok
  end

  def create
    @project = Project.new(create_project_params)
    if @project.save
      render json: @project, status: :created
    else
      render json: {errors: [@project.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  def update
    if @project.update_attributes(update_project_params)
      render json: @project, status: :ok
    else
      render json: {errors: [@project.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  def destroy
    if @project.destroy
      head :ok
    else
      render json: {errors: [@position.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  private

  def create_project_params
    params.require(:project).permit(:name).merge(owner: current_user)
  end

  def update_project_params
    params.require(:project).permit(:name, :status)
  end
end