require 'rails_helper'

RSpec.describe Api::V1::InvitationsController, type: :controller do
  let!(:owner) { FactoryGirl.create(:owner) }
  let!(:members) { (0..2).map { FactoryGirl.create(:user) } }
  let(:application) { FactoryGirl.create(:origin_application) }
  let(:access_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: owner.id) }
  let!(:projects) { (0..2).map { FactoryGirl.create(:project, owner: owner) } }
  let!(:invitations) { members.each { |member| FactoryGirl.create(:invitation, sender: owner, recipient: member, project: projects.sample)}}

  before do
    request.accept = 'application/json'
  end

  describe 'GET #index' do
    context 'when no filters are applied' do
      before { get :index, access_token: access_token.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to match_response_schema(:invitations) }
      it { expect(JSON.parse(response.body)['data'].size).to eq invitations.length }
    end
  end

end