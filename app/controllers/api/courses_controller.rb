class Api::CoursesController < ApplicationController
  def index
    render json: Course.with_enrollment(current_user.id)
  end

  def init
    id = params[:id].to_i
    data = Course.init_course(id)
    render json: data
  end
end
