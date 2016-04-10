require 'rails_helper'

RSpec.describe Api::V1::MockupsController, type: :controller do
  let!(:owner) { FactoryGirl.create(:owner) }
  let!(:members) { (0..2).map { FactoryGirl.create(:user) } }
  let(:application) { FactoryGirl.create(:origin_application) }
  let(:access_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: owner.id) }
  let!(:project) { FactoryGirl.create(:project, owner: owner) }
  let!(:raw_images) { (0..4).map { FactoryGirl.create(:raw_image, owner: owner) } }
  let!(:mockups) { (0..4).map { |i| FactoryGirl.create(:mockup, project: project, owner: owner, raw_image: raw_images[i]) } }

  before do
    request.accept = 'application/json'
    project.members << members
  end

  describe 'GET #index' do
    context 'when mockups exist' do
      before { get :index, access_token: access_token.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to match_response_schema(:mockups) }
      it { expect(JSON.parse(response.body)['data'].size).to eq mockups.length }
    end
  end

  describe 'GET #show' do
    context 'when mockup exists' do
      before { get :show, id: mockups.sample.id, access_token: access_token.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to match_response_schema(:mockup) }
    end

    context 'when mockup not exists' do
      before { get :show, id: 'invalid', access_token: access_token.token }

      it { expect(response).to have_http_status(:not_found) }
      it { expect(JSON.parse(response.body)).to have_key('message') }
      it { expect(JSON.parse(response.body)['message']).to eq I18n.t('activerecord.exception.not_found') }
    end
  end

  describe 'POST #create' do
    let(:valid_mockup) { {type: 'mockups', attributes: {name: "New Mockup"}} }
    let(:mockup_relationships) { {project: {data: {type: 'projects', id: project.id}}} }

    context 'when all params is valid' do
      before { post :create, data: valid_mockup.merge({relationships: mockup_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:created) }
      it { expect(response).to match_response_schema(:mockup) }
      it { expect(JSON.parse(response.body)['data']['attributes']['name']).to eq 'New Mockup' }
      it { expect(JSON.parse(response.body)['data']['attributes']['status']).to eq 'created' }
    end

    context 'when all params is valid, with raw image' do
      let(:valid_mockup_image) { {type: 'mockups', attributes: {name: "New Mockup", raw_image: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec', 'fixtures', 'assets', 'mockup_image.jpg'))}} }
      before { post :create, data: valid_mockup_image.merge({relationships: mockup_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:created) }
      it { expect(response).to match_response_schema(:mockup) }
      it { expect(JSON.parse(response.body)['data']['attributes']['name']).to eq 'New Mockup' }
      # TODO check image upload success
    end
  end

  describe 'PATCH #update' do

  end

  describe 'DELETE #destroy' do
    let(:member_sample) { members.sample }
    let(:other_member_sample) { FactoryGirl.create(:user) }
    let(:member_mockup) { FactoryGirl.create(:mockup, project: project, owner: member_sample, raw_image: raw_images.sample) }
    let(:member_access_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: member_sample.id) }
    let(:other_member_access_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: other_member_sample.id) }

    context 'when user is project owner' do
      before { delete :destroy, id: member_mockup.id, access_token: access_token.token }

      it { expect(response).to have_http_status(:no_content) }
    end

    context 'when user is mockup onwer' do
      before { delete :destroy, id: member_mockup.id, access_token: member_access_token.token }

      it { expect(response).to have_http_status(:no_content) }
    end

    context 'when user is not project owner' do
      before { delete :destroy, id: member_mockup.id, access_token: other_member_access_token.token }

      it { expect(response).to have_http_status(:unauthorized) }
      it { expect(JSON.parse(response.body)).to have_key('message') }
      it { expect(JSON.parse(response.body)['message']).to eq I18n.t('authroization.unauthorized') }
    end

    context 'when user is not mockup owner' do
      before { delete :destroy, id: member_mockup.id, access_token: other_member_access_token.token }

      it { expect(response).to have_http_status(:unauthorized) }
      it { expect(JSON.parse(response.body)).to have_key('message') }
      it { expect(JSON.parse(response.body)['message']).to eq I18n.t('authroization.unauthorized') }
    end
  end
end