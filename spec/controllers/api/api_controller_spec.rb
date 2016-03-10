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

  describe 'jsonapi_params' do
    let(:jsonapi_request) { JSON.parse(
      '{"data":{"id":"102","type":"resources","attributes":{"uid":"YVNHE9mGukamOHbgpr_Q_w",'\
            '"position":"Assistant Corporate Consultant","name":"Hollie Veum","email":'\
            '"raleigh.gutkowski@toycollier.us","phone":"(750)793-7322 x2731","address":'\
            '"496 Hand Manors, North Deonteburgh, Rwanda","photo_url":null,"cover_letter_url":null,'\
            '"resume_url":null,"profile_urls":null,"created_at":"2015-11-19T04:33:31.652Z",'\
            '"updated_at":"2015-12-04T09:32:15.415Z"},"relationships":{"educations":{"data":[]}'\
            ',"experiences":{"data":[]},"relation":{"data":{"id":"3","type":"relations"}},"source":'\
            '{"data":[{"id":"1","type":"sources"},{"id":"2","type":"sources"}]}}}}') }

    controller(Api::V1::ApiController) do
      def update
        render json: jsonapi_params.require('resource').permit(:relation_id, :name, :source_ids => [])
      end
    end

    before do
      routes.draw do
        resources :jsons, to: 'api/v1/api#update'
      end
      patch :update, { id: 1 }.merge(jsonapi_request)
    end

    context 'known relation included' do
      it { expect(response.body).to include('relation_id') }
    end

    context 'array of source id included' do
      it { expect(response.body).to include('source_ids') }
    end

    context 'known attribute included' do
      it { expect(response.body).to include('Hollie') } # name
    end

    context 'unknown attribute excluded' do
      it { expect(response.body).not_to include('793-7322') } # phone
    end
  end
end