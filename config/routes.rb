Rails.application.routes.draw do
  devise_for :users, skip: [
                     :sessions,
                     :registrations,
                     :confirmations,
                     :passwords]

  devise_scope :user do
    post '/api/v1/users', to: 'registrations#create'
  end

  use_doorkeeper

  scope 'api/v1', module: 'api/v1' do
    resources :projects, only: [:index, :show, :create, :update, :destroy]
  end
end
