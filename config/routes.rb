Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'api/auth'
  namespace :api do
    resources :courses
    get 'init_courses/:id', to: 'courses#init'
    post 'register', to: 'passwords#reset'
    post '/reset_password', to: 'passwords#reset_password'
  end

  #Do not place any routes below this one
  if Rails.env.production?
    get '*other', to: 'static#index'
  end
end
