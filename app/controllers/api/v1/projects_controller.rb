class Api::V1::ProjectsController < Api::V1::ApiController
  before_action :authenticate_user!
  before_action :page_params

  load_resource except: [:index, :create]
  authorize_resource

  def index
    filters = {}
    filters[:owner] = params[:owner] unless params[:owner].blank?

    @projects = Project
                  .accessible_by(current_ability)
                  .search(filters)
                  .page(@page)
                  .per(@per_page)

    render json: @projects,
           meta: pagination_dict(@projects),
           status: :ok
  end

  def show
    render json: @project, status: :ok
  end

  def create
    @project = Project.new(project_params)
    @project.owner = current_user

    if @project.save
      render json: @project, status: :created
    else
      render json: {errors: [@project.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  def update
    # in case of change project owner
    @project.user_id = jsonapi_params[:project][:owner_id] if jsonapi_params[:project][:owner_id]
    if @project.update_attributes(update_project_params)
      render json: @project, status: :ok
    else
      render json: {errors: [@project.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  def destroy
    if @project.destroy
      head :no_content
    else
      render json: {errors: [@project.errors.full_messages.to_sentence]}, status: :unprocessable_entity
    end
  end

  private

  def project_params
    jsonapi_params.require(:project).permit(:name, :image)
  end

  def update_project_params
    jsonapi_params.require(:project).permit(:name, :image, :member_ids => [])
  end
end