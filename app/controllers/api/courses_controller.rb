class Api::CoursesController < ApplicationController
  def index
    if current_user.is_admin
      render json: Course.order(canvas_id: :desc)
    else
      render json: Course.with_enrollment(current_user.id)
    end
  end

  def show 
    users = Course.with_enrollments(params[:id])
    user = users.find { |u| u.user_id === current_user.id }
    if current_user.is_admin || user
      usrObj = current_user.is_admin ? current_user : user
      enrollments = users.select { |u| u.role == 'student' }
      render json: { users: enrollments, user: usrObj }
    else
      render json: 'restricted', status: 422
    end
  end

  def init
    id = params[:id].to_i
    data = Course.init_course(id)
    render json: data
  end
end
