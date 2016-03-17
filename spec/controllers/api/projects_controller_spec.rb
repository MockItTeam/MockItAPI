require 'rails_helper'

RSpec.describe Api::V1::ProjectsController, type: :controller do
  let!(:owner) { FactoryGirl.create(:owner) }
  let!(:members) { (0..2).map { FactoryGirl.create(:user) } }
  let(:application) { FactoryGirl.create(:origin_application) }
  let(:access_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: owner.id) }
  let(:member_access_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: members.sample.id) }
  let!(:projects) { (0..2).map { FactoryGirl.create(:project, owner: owner) } }

  before do
    request.accept = 'application/json'
    projects.each { |project| project.members << members }
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
    let(:valid_project) { {type: 'projects', attributes: {name: 'Test'}} }
    let(:invalid_project) { {type: 'projects', attributes: {name: '####'}} }

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
    let(:sample_project) { FactoryGirl.create(:project, owner: owner) }
    let(:valid_project) { {type: 'projects', attributes: {name: 'Change'}} }
    let(:invalid_project) { {type: 'projects', attributes: {name: '####'}} }

    let(:same_name_project) { {type: 'projects', attributes: {name: sample_project.name}} }

    let(:project_relationships) { {owner: {data: {type: 'users', id: owner.id}}} }

    context 'change project name' do
      before { patch :update, id: projects.sample.id, data: valid_project.merge({relationships: project_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to match_response_schema('project') }
      it { expect(JSON.parse(response.body)['data']['attributes']['name']).to eq 'Change' }
    end

    context 'change project owner' do
      let(:change_owner_project_relationships) { {owner: {data: {type: 'users', id: members.sample.id}}} }
      before { patch :update, id: projects.sample.id, data: valid_project.merge({relationships: change_owner_project_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to match_response_schema('project') }
      it { expect(JSON.parse(response.body)['data']['relationships']['owner']['data']['id']).not_to eq owner.id }
    end

    context 'kick other project members' do
      let(:kick_project_member_relationships) { {members: {data: [{type: 'users', id: members.sample.id}]}} }
      before { patch :update, id: projects.sample.id, data: valid_project.merge({relationships: kick_project_member_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to match_response_schema('project') }
      it { expect(JSON.parse(response.body)['data']['relationships']['members'].size).to eq 1 }
    end

    context 'with invalid name' do
      before { patch :update, id: projects.sample.id, data: invalid_project.merge({relationship: project_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:unprocessable_entity) }
      it { expect(JSON.parse(response.body)).to have_key('errors') }
      it { expect(JSON.parse(response.body)['errors'][0]).to match(/Only.*allowed/i) }
    end

    context "with same other project's name" do
      before { patch :update, id: projects.sample.id, data: same_name_project.merge({relationship: project_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:unprocessable_entity) }
      it { expect(JSON.parse(response.body)).to have_key('errors') }
      it { expect(JSON.parse(response.body)['errors'][0]).to eq "Name must be unique per user" }
    end
  end

  describe 'DELETE #destroy' do
    context 'when user is project owner' do
      before { delete :destroy, id: projects.sample.id, access_token: access_token.token }

      it { expect(response).to have_http_status(:no_content) }
    end

    context 'when user is not project owner' do
      before { delete :destroy, id: projects.sample.id, access_token: member_access_token.token }

      it { expect(response).to have_http_status(:unauthorized) }
      it { expect(JSON.parse(response.body)).to have_key('message') }
      it { expect(JSON.parse(response.body)['message']).to eq I18n.t('authroization.unauthorized') }
    end
  end
end