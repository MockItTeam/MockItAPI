require 'rails_helper'

RSpec.describe Api::V1::ApiController, type: :controller do
  describe '#authenticate_user!' do

    controller(Api::V1::ApiController) do
      before_action :authenticate_user!

      def authenticate
        render nothing: true
      end
    end

    before do
      routes.draw { get 'authenticate', to: 'api/v1/api#authenticate' }
    end

    context 'when access token is invalid' do
      it do
        get :authenticate
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end