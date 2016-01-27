class Api::V1::ProjectsController < Api::V1::ApiController
  before_action :authenticate_user!
  before_action :page_params

  authorize_resource
  load_resource except: :create

  def index
    respond_to do |format|
      format.json { render json: @projects, status: :ok }
    end
  end

  def show
    respond_to do |format|
      format.json { render json: @project, status: :ok }
    end
  end

  def create
    @project = Project.new(create_project_params)
    respond_to do |format|
      if @project.save
        format.json { render json: @project, status: :created }
      else
        format.json { render json: {errors: [@project.errors.full_messages.to_sentence]}, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @project.update_attributes(update_project_params)
        format.json { render json: @project, status: :ok }
      else
        format.json { render json: {errors: [@project.errors.full_messages.to_sentence]}, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @project.status = params['status'] if params['status']
    if @project.save
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