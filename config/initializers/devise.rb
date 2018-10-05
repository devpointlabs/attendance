Devise.setup do |config|
  config.secret_key = ENV['DEVISE_SECRET_KEY'] ? ENV['DEVISE_SECRET_KEY'] : SecureRandom.hex
end

