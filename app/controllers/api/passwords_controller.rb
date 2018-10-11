class Api::PasswordsController < ApplicationController
  skip_before_action :authenticate_user!

  def reset 
    email = params[:email]
    begin
      user = User.find_by!(email: email)
      user.send_reset_password_instructions
    rescue  => e
      render json: e, status: 422
    end
  end

  def reset_password
    token = params[:token]
    password = params[:password]
    user = User.with_reset_password_token(token)
    if user
      user.update(password: password)
    else
      render json: 'Invalid Token', status: 422
    end
  end
end
