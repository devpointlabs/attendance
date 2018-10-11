class Api::PasswordsController < ApplicationController
  skip_before_action :authenticate_user!

  def reset 
    email = params[:email]
    begin
      user = User.find_by!(email: email)
      user.send_reset_password_instructions
    rescue  => e
      Rails.logger.error("ERROR: #{e}")
      render json: 'Canvas User not Found.  Please try another email', status: 422
    end
  end

  def reset_password
    token = params[:token]
    password = params[:password]
    user = User.with_reset_password_token(token)
    if user
      user.update(password: password)
    else
      Rails.logger.error("ERROR: #{user.errors}")
      render json: 'Invalid Token', status: 422
    end
  end
end
