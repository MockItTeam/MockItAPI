require 'rails_helper'

RSpec.describe RegistrationsController, type: :controller do
  include Devise::TestHelpers

  describe 'POST #create' do
    before do
      @request.env['devise.mapping'] = Devise.mappings[:user]
    end

    context 'when sign up with valid information' do
      let(:valid_user) { FactoryGirl.attributes_for(:user) }

      before { post :create, format: :json, user: valid_user }

      it { expect(response).to have_http_status(:created) }

      it 'a user is created' do
        expect(User.count).to eq 1
      end
    end

    context 'when sign up with invalid information' do
      let(:invalid_user) { FactoryGirl.attributes_for(:user, username: '#####') }

      before { post :create, format: 'json', user: invalid_user }

      it { expect(response).to have_http_status(:unprocessable_entity) }

      it 'a user is not created' do
        expect(User.count).to eq 0
      end
    end
  end
end