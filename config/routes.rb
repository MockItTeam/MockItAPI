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
    resources :users, only: [:index, :show]
    resources :invitations, only: [:index, :show, :create, :update, :destroy]
    resources :mockups, only: [:index, :show, :create, :update, :destroy]
    resources :raw_images, only: [:show]
  end

  # Admin page route
  get '/admin', to: 'admin#index'

  # Ember route
  mount_ember_app :frontend, to: '/', controller: 'application', action: 'frontend'
  get '/var/images/:name', to: 'api/v1/raw_images#get_image', defaults: {format: %w(jpg jpeg gif png)}
end
