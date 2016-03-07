require 'rails_helper'

RSpec.describe Api::V1::ProjectsController, type: :controller do
  let!(:owner) { FactoryGirl.create(:owner) }
  let!(:members) { (0..5).map { FactoryGirl.create(:user) } }
  let(:application) { FactoryGirl.create(:origin_application) }
  let(:access_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: owner.id) }
  let!(:projects) { (0..5).map { FactoryGirl.create(:project, owner: owner, members: members) } }
  let!(:mockups) { (0..2).map { FactoryGirl.create(:mockup, project: projects.sample, user: members.sample) } }

  before do
    request.accept = 'application/json'
  end

  describe 'GET #index' do
    context 'when projects exist' do
      before { get :index, access_token: access_token.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to match_response_schema(:projects) }
      it { expect(JSON.parse(response.body)['data'].size).to eq projects.length }
    end
  end

  describe 'GET #show' do
    context 'when project exists' do
      before { get :show, id: projects.sample.id, access_token: access_token.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to match_response_schema(:project) }
    end

    context 'when project not exists' do
      before { get :show, id: 'invalid', access_token: access_token.token }

      it { expect(response).to have_http_status(:not_found) }
      it { expect(JSON.parse(response.body)).to have_key('message') }
      it { expect(JSON.parse(response.body)['message']).to eq I18n.t('activerecord.exception.not_found') }
    end
  end

  describe 'POST #create' do
    let(:valid_project) { { type: 'projects', attributes: { name: 'Test' } } }
    let(:invalid_project) { { type: 'projects', attributes: { name: '####' } } }

    context 'when all params is valid' do
      before { post :create, data: valid_project, access_token: access_token.token }

      it { expect(response).to have_http_status(:created) }
      it { expect(response).to match_response_schema(:project) }
      it { expect(JSON.parse(response.body)['data']['attributes']['name']).to eq 'Test' }
    end

    context 'when params is invalid' do
      before { post :create, data: invalid_project, access_token: access_token.token }

      it { expect(response).to have_http_status(:unprocessable_entity) }
      it { expect(JSON.parse(response.body)).to have_key('errors') }
      it { expect(JSON.parse(response.body)['errors'][0]).to match(/Only.*allowed/i) }
    end
  end

  describe 'PATCH #update' do
    let(:valid_project) { { type: 'projects', attributes: { name: 'Change' } } }
    let(:invalid_project) { { type: 'projects', attributes: { name: '####' } } }
    let(:project_relationships) { { owner: { data: { type: 'users', id: owner.id } } } }

    before { patch :update, id: projects.sample.id, data: valid_project.merge({ relationships: project_relationships }), access_token: access_token.token }

    it { expect(response).to have_http_status(:ok) }
    it { expect(response).to match_response_schema('project') }
    it { expect(JSON.parse(response.body)['data']['attributes']['name']).to eq 'Change' }
  end
end