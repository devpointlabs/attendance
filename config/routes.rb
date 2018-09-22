Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'api/auth'
  namespace :api do
    resources :courses, only: [:index, :show, :destroy, :update]
    get 'init_courses/:id', to: 'courses#init'
    post 'register', to: 'passwords#reset'
    post '/reset_password', to: 'passwords#reset_password'
    resources :records, only: :create
    post '/records/:course_id/by_date', to: 'records#date'
    get '/records/:course_id/users/:id', to: 'records#individual'
  end

  #Do not place any routes below this one
  if Rails.env.production?
    get '*other', to: 'static#index'
  end
end
