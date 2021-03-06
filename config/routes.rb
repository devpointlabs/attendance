Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'api/auth'
  namespace :api do
    resources :courses, only: [:index, :show, :destroy, :update] do
      resources :grade_weights, only: [:create, :update]
    end
    put 'courses/:id/update', to: 'courses#edit'
    get 'init_courses/:id/update', to: 'courses#init'
    get 'courses/:course_id/grades/:user_id', to: 'courses#grades'
    post 'register', to: 'passwords#reset'
    post '/reset_password', to: 'passwords#reset_password'
    post '/records/:course_id/all_present', to: 'records#all_present'
    resources :records, only: :create
    post '/upload_attendance', to: 'records#upload'
    post '/records/:course_id/by_date', to: 'records#date'
    get '/records/:course_id/users/:id', to: 'records#individual'
    resources :enrollments
    post '/reports/courses/:course_id', to: 'reports#course_report'
    post '/reports/courses/:course_id/users/:id', to: 'reports#user_in_course'
    resources :reports, only: [:index, :show, :destroy]
    resources :events
  end

  #Do not place any routes below this one
  if Rails.env.production?
    get '*other', to: 'static#index'
  end
end
