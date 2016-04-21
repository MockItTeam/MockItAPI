require 'rails_helper'

RSpec.describe Api::V1::InvitationsController, type: :controller do
  let!(:owner) { FactoryGirl.create(:owner) }
  let!(:members) { (0..2).map { FactoryGirl.create(:user) } }
  let!(:invite_members) { (0..2).map { FactoryGirl.create(:user) } }
  let(:application) { FactoryGirl.create(:origin_application) }
  let(:access_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: owner.id) }
  let!(:projects) { (0..2).map { FactoryGirl.create(:project, owner: owner) } }
  let!(:invitations) { (0..2).map { |i| FactoryGirl.create(:invitation, sender: owner, recipient: invite_members[i], project: projects.sample) } }

  before do
    request.accept = 'application/json'
    projects.each { |project| project.members << members }
  end

  describe 'GET #index' do
    context 'when no filters are applied' do
      before { get :index, access_token: access_token.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to match_response_schema(:invitations) }
      it { expect(JSON.parse(response.body)['data'].size).to eq invitations.length }
    end

    context 'when filter user_id is set to specific value' do
      let(:sample_recipient_id) { invitations.sample.recipient_id }
      let(:sample_invitations) { invitations.select { |invitation| sample_recipient_id.eql? invitation.recipient_id } }
      let(:recipient_access_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: sample_recipient_id) }

      before { get :index, condition: 'recipient', access_token: recipient_access_token.token }

      it do
        expect(JSON.parse(response.body)['data'].length).to eq sample_invitations.length
      end
    end
  end

  describe 'GET #show' do
    context 'when invitation exists' do
      before { get :show, id: invitations.sample.id, access_token: access_token.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to match_response_schema(:invitation) }
    end

    context 'when invitation not exists' do
      before { get :show, id: 'invalid', access_token: access_token.token }

      it { expect(response).to have_http_status(:not_found) }
      it { expect(JSON.parse(response.body)).to have_key('message') }
      it { expect(JSON.parse(response.body)['message']).to eq I18n.t('activerecord.exception.not_found') }
    end
  end

  describe 'POST #create' do
    let(:sample_recipient) { FactoryGirl.create(:user) }
    let(:sample_recipient_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: sample_recipient.id) }
    let(:sample_project) { projects.sample }
    let(:valid_invitation) { {type: 'invitations', attributes: {}} }

    let(:invitation_relationships) { {project: {data: {type: 'projects', id: sample_project.id}}, recipient: {data: {type: 'users', id: sample_recipient.id}}} }

    context 'when all params is valid' do
      before { post :create, data: valid_invitation.merge({relationships: invitation_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:created) }
      it { expect(response).to match_response_schema(:invitation) }
      it { expect(JSON.parse(response.body)['data']['attributes']['sender_name']).to eq owner.username }
      it { expect(JSON.parse(response.body)['data']['attributes']['recipient_name']).to eq sample_recipient.username }
      it { expect(JSON.parse(response.body)['data']['attributes']['project_name']).to eq sample_project.name }
      it { expect(JSON.parse(response.body)['data']['attributes']['status']).to eq 'pending' }
    end

    context 'when invalid recipient' do
      let(:invalid_invitation) { {type: 'invitations', attributes: {}} }
      let(:invalid_invitation_relationships) { {project: {data: {type: 'projects', id: sample_project.id}}, recipient: {data: {type: 'users', id: ''}}} }

      before { post :create, data: invalid_invitation.merge({relationships: invalid_invitation_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:unprocessable_entity) }
      it { expect(JSON.parse(response.body)).to have_key('errors') }
      it { expect(JSON.parse(response.body)['errors'][0]).to match(/Invitee.*founded/i) }
    end

    context 'when sender is not project owner' do
      let(:invalid_invitation) { {type: 'invitations', attributes: {}} }

      before { post :create, data: invalid_invitation.merge({relationships: invitation_relationships}), access_token: sample_recipient_token.token }

      it { expect(response).to have_http_status(:unprocessable_entity) }
      it { expect(JSON.parse(response.body)).to have_key('errors') }
      it { expect(JSON.parse(response.body)['errors'][0]).to eq 'Cannot invite other user, because you are not project owner' }
    end

    context 'when recipient is invited already' do
      let(:invalid_invitation) { {type: 'invitations', attributes: {}} }
      let(:sample_invitation) { invitations.sample }
      let(:exist_invitation_relationships) { {project: {data: {type: 'projects', id: sample_invitation.project_id}}, recipient: {data: {type: 'users', id: sample_invitation.recipient_id}}} }

      before { post :create, data: invalid_invitation.merge({relationships: exist_invitation_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:unprocessable_entity) }
      it { expect(JSON.parse(response.body)).to have_key('errors') }
      it { expect(JSON.parse(response.body)['errors'][0]).to match(/is.*already/i) }
    end
  end

  describe 'PATCH #update' do
    let(:sample_invitation) { invitations.sample }
    let(:sample_sender) { sample_invitation.sender }
    let(:sample_recipient) { sample_invitation.recipient }

    describe 'when updater is recipient' do
      let(:recipient_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: sample_recipient.id) }
      let(:invitation_relationships) { {project: {data: {type: 'projects', id: sample_invitation.project.id}}, recipient: {data: {type: 'users', id: sample_recipient.id}}} }

      context 'update status from pending to accepted' do
        let(:valid_invitation) { {type: 'invitations', attributes: {status: 'accepted'}} }
        before { patch :update, id: sample_invitation.id, data: valid_invitation.merge({relationships: invitation_relationships}), access_token: recipient_token.token }

        it { expect(response).to have_http_status(:ok) }
        it { expect(response).to match_response_schema(:invitation) }
        it { expect(JSON.parse(response.body)['data']['attributes']['status']).to eq 'accepted' }
      end

      context 'update status from pending to refused' do
        let(:valid_invitation) { {type: 'invitations', attributes: {status: 'refused'}} }
        before { patch :update, id: sample_invitation.id, data: valid_invitation.merge({relationships: invitation_relationships}), access_token: recipient_token.token }

        it { expect(response).to have_http_status(:ok) }
        it { expect(response).to match_response_schema(:invitation) }
        it { expect(JSON.parse(response.body)['data']['attributes']['status']).to eq 'refused' }
      end
    end

    describe 'when updater is sender' do
      let(:invitation_relationships) { {project: {data: {type: 'projects', id: sample_invitation.project.id}}, recipient: {data: {type: 'users', id: sample_recipient.id}}} }
      let(:valid_invitation) { {type: 'invitations', attributes: {status: 'accepted'}} }
      before { patch :update, id: sample_invitation.id, data: valid_invitation.merge({relationships: invitation_relationships}), access_token: access_token.token }

      it { expect(response).to have_http_status(:unprocessable_entity) }
      it { expect(JSON.parse(response.body)).to have_key('errors') }
      it { expect(JSON.parse(response.body)['errors'][0]).to match(/cannot.*status/i) }
    end
  end

  describe 'DELETE #destroy' do
    let(:sample_invitation) { invitations.sample }
    let(:member_token) { FactoryGirl.create(:access_token, application: application, resource_owner_id: members.sample.id) }

    context 'when user is project owner' do
      before { delete :destroy, id: sample_invitation.id, access_token: access_token.token }

      it { expect(response).to have_http_status(:no_content) }
    end

    context 'when user is not project owner' do
      before { delete :destroy, id: sample_invitation.id, access_token: member_token.token }

      it { expect(response).to have_http_status(:unauthorized) }
      it { expect(JSON.parse(response.body)).to have_key('message') }
      it { expect(JSON.parse(response.body)['message']).to eq I18n.t('authroization.unauthorized') }
    end
  end

end