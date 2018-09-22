class Api::EnrollmentsController < ApplicationController
  def index
    render json: Enrollment.students
  end
end
