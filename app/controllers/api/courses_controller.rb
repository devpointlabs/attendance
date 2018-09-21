class Api::CoursesController < ApplicationController
  def index
    if current_user.is_admin
      render json: Course.order(canvas_id: :desc)
    else
      render json: Course.with_enrollment(current_user.id)
    end
  end

  def init
    id = params[:id].to_i
    data = Course.init_course(id)
    render json: data
  end
end
