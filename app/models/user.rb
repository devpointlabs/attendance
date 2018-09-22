# frozen_string_literal: true

class User < ActiveRecord::Base
  acts_as_paranoid
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :enrollments, dependent: :destroy
  has_many :courses, through: :enrollments

end
