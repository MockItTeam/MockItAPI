Rails.application.routes.draw do
  use_doorkeeper
  devise_for :users, skip: [
                     :sessions,
                     :registrations,
                     :confirmations,
                     :passwords]

  devise_scope :user do
    post '/users', to: 'registrations#create'
  end

  scope 'api/v1', module: 'api/v1' do
    resources :raw_images, only: [:index, :show, :create, :update]
  end
end
